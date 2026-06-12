import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { colors, typography, spacing } from '../constants/theme';

// Onboarding screens
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { ExamTypeScreen } from '../screens/onboarding/ExamTypeScreen';
import { SubjectSelectionScreen } from '../screens/onboarding/SubjectSelectionScreen';
import { ExamDateScreen } from '../screens/onboarding/ExamDateScreen';
import { DiagnosticQuizScreen } from '../screens/onboarding/DiagnosticQuizScreen';
import { DiagnosticResultsScreen } from '../screens/onboarding/DiagnosticResultsScreen';

// Main screens
import { HomeScreen } from '../screens/home/HomeScreen';
import { LearnScreen } from '../screens/learn/LearnScreen';
import { TopicListScreen } from '../screens/learn/TopicListScreen';
import { AIChatScreen } from '../screens/learn/AIChatScreen';
import { PracticeHubScreen } from '../screens/practice/PracticeHubScreen';
import { FlashcardScreen } from '../screens/practice/FlashcardScreen';
import { QuizScreen } from '../screens/practice/QuizScreen';
import { QuizResultsScreen } from '../screens/practice/QuizResultsScreen';
import { ProgressScreen } from '../screens/progress/ProgressScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

import type {
  AuthStackParamList,
  MainTabParamList,
  LearnStackParamList,
  PracticeStackParamList,
} from './types';

const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const LearnStack = createStackNavigator<LearnStackParamList>();
const PracticeStack = createStackNavigator<PracticeStackParamList>();

function TabIcon({ name, focused }: { name: string; focused: boolean }): React.JSX.Element {
  const icons: Record<string, string> = {
    Home: '🏠',
    Learn: '📚',
    Practice: '✏️',
    Progress: '📊',
    Profile: '👤',
  };
  return (
    <View style={tabStyles.iconContainer}>
      <Text style={tabStyles.iconText}>{icons[name] ?? '•'}</Text>
      {focused && <View style={tabStyles.activeDot} />}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
});

function LearnNavigator(): React.JSX.Element {
  return (
    <LearnStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: typography.fontWeightSemiBold },
      }}
    >
      <LearnStack.Screen name="LearnHome" component={LearnScreen} options={{ title: 'Learn' }} />
      <LearnStack.Screen
        name="TopicList"
        component={TopicListScreen}
        options={({ route }) => ({ title: route.params.subjectName })}
      />
      <LearnStack.Screen
        name="AIChat"
        component={AIChatScreen}
        options={({ route }) => ({ title: route.params.title ?? 'AI Tutor' })}
      />
    </LearnStack.Navigator>
  );
}

function PracticeNavigator(): React.JSX.Element {
  return (
    <PracticeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: typography.fontWeightSemiBold },
      }}
    >
      <PracticeStack.Screen
        name="PracticeHub"
        component={PracticeHubScreen}
        options={{ title: 'Practice' }}
      />
      <PracticeStack.Screen
        name="Flashcard"
        component={FlashcardScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <PracticeStack.Screen
        name="Quiz"
        component={QuizScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <PracticeStack.Screen
        name="QuizResults"
        component={QuizResultsScreen}
        options={{ title: 'Results', headerLeft: () => null }}
      />
    </PracticeStack.Navigator>
  );
}

function MainNavigator(): React.JSX.Element {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: spacing.sm,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: typography.fontSizeXs,
          fontWeight: typography.fontWeightMedium,
        },
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Learn" component={LearnNavigator} />
      <MainTab.Screen name="Practice" component={PracticeNavigator} />
      <MainTab.Screen name="Progress" component={ProgressScreen} />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
    </MainTab.Navigator>
  );
}

function AuthNavigator(): React.JSX.Element {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="ExamTypeSelection" component={ExamTypeScreen} />
      <AuthStack.Screen name="SubjectSelection" component={SubjectSelectionScreen} />
      <AuthStack.Screen name="ExamDate" component={ExamDateScreen} />
      <AuthStack.Screen name="DiagnosticQuiz" component={DiagnosticQuizScreen} />
      <AuthStack.Screen name="DiagnosticResults" component={DiagnosticResultsScreen} />
    </AuthStack.Navigator>
  );
}

export function RootNavigator(): React.JSX.Element {
  const { isAuthenticated, onboardingComplete } = useAuthStore();

  if (!isAuthenticated || !onboardingComplete) {
    return <AuthNavigator />;
  }

  return <MainNavigator />;
}
