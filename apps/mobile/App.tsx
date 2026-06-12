import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, Text } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/constants/theme';

interface EBState { hasError: boolean; error: string; }
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, EBState> {
  state: EBState = { hasError: false, error: '' };
  static getDerivedStateFromError(e: Error): EBState { return { hasError: true, error: e.message }; }
  render() {
    if (this.state.hasError) return (
      <View style={{ flex: 1, backgroundColor: '#0F0F1A', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: '#FF6584', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Something went wrong</Text>
        <Text style={{ color: '#FFFFFF', fontSize: 14, textAlign: 'center' }}>{this.state.error}</Text>
      </View>
    );
    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, staleTime: 1000 * 60 * 5 } },
});

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <StatusBar style="light" backgroundColor={colors.backgroundDark} />
              <RootNavigator />
            </NavigationContainer>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
});
