import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { SafeAreaView, View } from 'react-native';
import Text from '../components/core/Text.tsx';
// import useViewerContext from '../user/useViewerContext.tsx'; // No longer using mock login from here
import { useAuthStore } from '../store/authStore.ts'; // Import useAuthStore
import type { User, Session } from '@supabase/supabase-js'; // Import types for mock data

export default function Login() {
  const router = useRouter();
  // const { login } = useViewerContext(); // No longer using mock login from here
  const setUserAndSession = useAuthStore((state) => state.setUserAndSession); // Get action from store

  const onPress = useCallback(async () => {
    // Simulate a successful login by setting mock user and session data
    const mockUser: User = {
      id: 'mock-user-id',
      app_metadata: {},
      user_metadata: { name: 'Mock User' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    const mockSession: Session = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: mockUser,
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };
    setUserAndSession(mockUser, mockSession);
    // AuthStateSyncer in _layout.tsx will handle navigation based on the new auth state
    // router.replace('/'); // Remove direct navigation
  }, [setUserAndSession, router]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="w-full text-center text-lg" onPress={onPress}>
          <fbt desc="Login button">Login</fbt>
        </Text>
      </View>
    </SafeAreaView>
  );
}
