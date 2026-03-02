import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { isLoading, token, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!token && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      // Redirect to app if authenticated
      router.replace('/(app)');
    }
  }, [token, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return <Slot />;
}
