import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { LearnStackScreenProps } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type Props = LearnStackScreenProps<'AIChat'>;

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  hintLevel?: number;
  timestamp: Date;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm your AI Tutor. I use the Socratic method — I'll guide you to the answer rather than give it directly. What are you working on?",
  timestamp: new Date(),
};

const MOCK_RESPONSES = [
  "That's an interesting approach! Let me ask you this: what do you already know about this concept? What have you tried so far?",
  "Good thinking! Now consider this: if you were to break this problem into smaller steps, what would the first step be?",
  "You're on the right track! Think about what happens when you apply the underlying principle here. What do you notice?",
  "Excellent effort! Let's look at this from a different angle. Can you think of a similar problem you've solved before?",
  "Great persistence! You've made 3 attempts now. Here's a more direct hint: focus on the relationship between the variables and how they change relative to each other.",
];

let mockResponseIndex = 0;

export function AIChatScreen({ route }: Props): React.JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setAttemptCount((prev) => prev + 1);
    setIsTyping(true);

    setTimeout(() => {
      const responseContent = MOCK_RESPONSES[mockResponseIndex % MOCK_RESPONSES.length];
      mockResponseIndex += 1;

      const newAttemptCount = attemptCount + 1;
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        hintLevel: Math.min(newAttemptCount, 3),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1200);
  }, [inputText, attemptCount]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {attemptCount > 0 && (
          <View style={styles.attemptBanner}>
            <Text style={styles.attemptBannerText}>
              🎯 {attemptCount} attempt{attemptCount !== 1 ? 's' : ''} — keep going!
            </Text>
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                message.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant,
              ]}
            >
              {message.role === 'assistant' && (
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarEmoji}>🤖</Text>
                </View>
              )}

              <View style={styles.messageBubbleWrapper}>
                <View
                  style={[
                    styles.messageBubble,
                    message.role === 'user'
                      ? styles.messageBubbleUser
                      : styles.messageBubbleAssistant,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.role === 'user'
                        ? styles.messageTextUser
                        : styles.messageTextAssistant,
                    ]}
                  >
                    {message.content}
                  </Text>
                </View>

                {message.role === 'assistant' && message.hintLevel != null && message.hintLevel > 0 && (
                  <View style={styles.hintIndicator}>
                    <Text style={styles.hintIndicatorText}>
                      Hint {message.hintLevel}/3
                    </Text>
                  </View>
                )}

                <Text style={styles.messageTimestamp}>
                  {message.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={styles.messageRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>🤖</Text>
              </View>
              <View style={styles.typingBubble}>
                <Text style={styles.typingDots}>● ● ●</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask a question or share your attempt..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
            returnKeyType="default"
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isTyping}
            activeOpacity={0.85}
          >
            <Text style={styles.sendButtonText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  keyboardAvoid: {
    flex: 1,
  },
  attemptBanner: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary + '40',
  },
  attemptBannerText: {
    fontSize: typography.fontSizeSm,
    color: colors.primary,
    fontWeight: typography.fontWeightMedium,
    textAlign: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  messageRowUser: {
    flexDirection: 'row-reverse',
  },
  messageRowAssistant: {
    flexDirection: 'row',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    flexShrink: 0,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  messageBubbleWrapper: {
    maxWidth: '75%',
    gap: spacing.xs,
  },
  messageBubble: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  messageBubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: borderRadius.xs,
  },
  messageBubbleAssistant: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: typography.fontSizeMd,
    lineHeight: typography.lineHeightLg,
  },
  messageTextUser: {
    color: colors.textPrimary,
  },
  messageTextAssistant: {
    color: colors.textSecondary,
  },
  hintIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warning + '20',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.warning + '50',
  },
  hintIndicatorText: {
    fontSize: typography.fontSizeXs,
    color: colors.warning,
    fontWeight: typography.fontWeightSemiBold,
  },
  messageTimestamp: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    alignSelf: 'flex-end',
  },
  typingBubble: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xs,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typingDots: {
    fontSize: typography.fontSizeSm,
    color: colors.textMuted,
    letterSpacing: 4,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.fontSizeMd,
    color: colors.textPrimary,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  sendButtonText: {
    fontSize: typography.fontSizeLg,
    color: colors.textPrimary,
    fontWeight: typography.fontWeightBold,
  },
});
