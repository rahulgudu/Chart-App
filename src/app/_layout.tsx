import { Stack } from "expo-router";
import "../../global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import * as Sentry from '@sentry/react-native';

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "../contexts/AppProvider";
import ChatWrapper from "../components/ChatWrapper";


Sentry.init({
  dsn: 'https://a054d757010758ca80465304c2ebb1f6@o4510974122786816.ingest.us.sentry.io/4510985539485696',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <GestureHandlerRootView className="flex-1">
        <ChatWrapper>
          <AppProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              // <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </AppProvider>
        </ChatWrapper>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
