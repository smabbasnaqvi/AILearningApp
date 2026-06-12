# AI Study Companion

A premium mobile-first AI study companion for Grades 9–12 and university entrance exam preparation (SAT, ACT, A-Levels, IB).

## What's Inside

```
ailearningapp/
├── apps/
│   ├── mobile/        # React Native + Expo app (iOS, Android, Web)
│   └── server/        # Fastify API server
├── packages/
│   ├── types/         # Shared TypeScript types
│   └── utils/         # SM-2 SRS engine, mastery scoring, streak helpers
```

## Prerequisites

- Node.js 18+
- npm 9+

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run the mobile app

#### Web preview (no phone or simulator required)

```bash
cd apps/mobile
npx expo start --web
```

Opens at `http://localhost:8081` in your browser.

#### On your phone via Expo Go

1. Install **Expo Go** from the App Store or Google Play
2. From the repo root:

```bash
cd apps/mobile
npx expo start
```

3. Scan the QR code with Expo Go (Android) or your Camera app (iOS)

#### iOS Simulator (Mac + Xcode required)

```bash
cd apps/mobile
npx expo start --ios
```

#### Android Emulator (Android Studio + AVD required)

```bash
cd apps/mobile
npx expo start --android
```

---

## App Structure

### Screens

| Section | Screens |
|---------|---------|
| Onboarding | Welcome → Exam Type → Subject Selection → Exam Date → Diagnostic Quiz → Diagnostic Results |
| Home | Dashboard (streak, daily goal, exam countdown) |
| Learn | Subject List → Topic List → AI Chat Tutor |
| Practice | Hub → Flashcards → Quiz → Quiz Results |
| Progress | Overview (streak calendar, mastery bars, session history) |
| Profile | Account, settings, subscription |

### Navigation

- **Auth Stack**: shown to new/logged-out users (onboarding flow)
- **Main Tabs**: Home / Learn / Practice / Progress / Profile (shown after onboarding)

---

## Running the Server

The mobile app runs fully on mock data — **the server is not required for the UI demo.**

To run the server:

```bash
# 1. Set up environment variables
cp apps/server/.env.example apps/server/.env
# Edit .env and fill in DATABASE_URL, ANTHROPIC_API_KEY, JWT_SECRET

# 2. Run database migrations
cd apps/server
npx prisma migrate dev

# 3. Start the server
npm run dev
```

Server runs on `http://localhost:3000`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native 0.74, Expo 51, TypeScript |
| Navigation | React Navigation v6 (bottom tabs + stack) |
| State | Zustand (client), TanStack Query (server) |
| Backend | Fastify, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Cache | Redis + BullMQ |
| AI | Anthropic Claude API (Socratic tutor mode) |
| SRS | SM-2 algorithm (packages/utils) |
| Monorepo | Turborepo |

---

## Key Design Decisions

- **AI as Socratic tutor**: the AI never gives direct answers. It responds with guiding questions or hints. After 3 attempts, it explains the concept. This is enforced in the server system prompt.
- **SRS flashcards**: uses the SM-2 spaced repetition algorithm. Cards are scheduled based on how well you know them — easy cards appear less frequently.
- **Mastery scoring**: each topic has a 0–100 mastery score weighted by question difficulty, correctness, and recency of attempts.
- **Ethical gamification**: XP is only earned from real learning actions (correct answers, completed sessions). Streaks require meaningful study (not just opening the app).

---

## Development Branch

Active development: `claude/brave-feynman-m8af6g`
