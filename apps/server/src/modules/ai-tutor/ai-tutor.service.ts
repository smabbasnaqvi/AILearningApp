import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'],
});

const SOCRATIC_SYSTEM_PROMPT = `You are an expert AI tutor using the Socratic method. Your role is to guide students to discover answers themselves rather than providing direct answers.

CRITICAL RULES:
1. NEVER directly state the answer to a question unless the student has made 3 or more genuine attempts.
2. On the first attempt: Ask a guiding question that helps the student think about the problem from a new angle.
3. On the second attempt: Provide a hint that narrows down the concept without giving the answer.
4. On the third or more attempt: You may provide more direct guidance or the answer, but always explain the reasoning.
5. Always acknowledge what the student got right before addressing what's incorrect.
6. Use encouraging language and celebrate progress.
7. Break complex problems into smaller steps.
8. Connect new concepts to things the student already knows.
9. Ask "What do you think would happen if...?" to promote deeper thinking.
10. If a student is clearly frustrated, offer more direct support while still encouraging discovery.

When a student asks a question:
- Respond with a guiding question or hint
- Point them toward relevant concepts or prior knowledge
- Encourage them to try before you help

Remember: The goal is understanding, not just the correct answer.`;

export class AiTutorService {
  async createConversation(
    userId: string,
    data: { subtopicId?: string; topicId?: string }
  ) {
    return prisma.tutorConversation.create({
      data: {
        userId,
        subtopicId: data.subtopicId,
        topicId: data.topicId,
        attemptCount: 0,
      },
      include: { messages: true },
    });
  }

  async sendMessage(userId: string, conversationId: string, content: string) {
    const conversation = await prisma.tutorConversation.findFirst({
      where: { id: conversationId, userId },
      include: { messages: { orderBy: { timestamp: 'asc' } } },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Save user message
    await prisma.tutorMessage.create({
      data: {
        conversationId,
        role: 'user',
        content,
        timestamp: new Date(),
      },
    });

    // Increment attempt count
    const updatedConversation = await prisma.tutorConversation.update({
      where: { id: conversationId },
      data: { attemptCount: { increment: 1 } },
    });

    // Build messages for Anthropic
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...conversation.messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      { role: 'user', content },
    ];

    // Include attempt count context in system prompt
    const systemPrompt = `${SOCRATIC_SYSTEM_PROMPT}

Current context:
- Student attempt count in this conversation: ${updatedConversation.attemptCount}
- If attempt count >= 3, you may provide more direct guidance or the answer with full explanation.`;

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const assistantContent =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Save assistant message
    const assistantMessage = await prisma.tutorMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        hintLevel: Math.min(updatedConversation.attemptCount, 3),
      },
    });

    await prisma.tutorConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return {
      message: assistantMessage,
      attemptCount: updatedConversation.attemptCount,
    };
  }

  async getConversation(userId: string, conversationId: string) {
    return prisma.tutorConversation.findFirst({
      where: { id: conversationId, userId },
      include: { messages: { orderBy: { timestamp: 'asc' } } },
    });
  }

  async getUserConversations(userId: string) {
    return prisma.tutorConversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
