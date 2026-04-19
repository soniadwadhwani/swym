import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabs } from './src/navigation/BottomTabs';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorRoot}>
          <Text style={styles.errorTitle}>SWYM Error</Text>
          <Text style={styles.errorMsg}>{this.state.error.message}</Text>
          <Text style={styles.errorStack}>
            {this.state.error.stack?.slice(0, 600)}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <NavigationContainer>
            <BottomTabs />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3F1EE',
  },
  errorRoot: {
    flex: 1,
    backgroundColor: '#140C32',
    padding: 40,
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 16,
  },
  errorMsg: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  errorStack: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'monospace',
  },
});
