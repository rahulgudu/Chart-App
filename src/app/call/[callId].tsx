/* eslint-disable react-hooks/exhaustive-deps */
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Call,
  CallContent,
  CallingState,
  IncomingCall,
  OutgoingCall,
  StreamCall,
  useCall,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useChatContext } from "stream-chat-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/lib/theme";

const CallScreen = () => {
  const { callId } = useLocalSearchParams<{ callId: string }>();
  const videoClient = useStreamVideoClient();
  const { client: chatClient } = useChatContext();

  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoClient || !callId) return;

    const startCall = async () => {
      try {
        // Find channel by ID to find its members
        const channel = chatClient.channel("messaging", callId);
        await channel.watch();

        const _call = videoClient.call("default", callId);

        const members = Object.values(channel.state.members).map((member) => ({
          user_id: member?.user?.id as string,
        }));

        await _call.getOrCreate({
          ring: true,
          data: {
            members,
            custom: {
              triggeredBy: chatClient.user?.id,
            },
          },
        });

        setCall(_call);
      } catch (error) {
        console.error("Failed to start call:", error);
        setError("Failed to start call. Please try again.");
      }
    };

    startCall();

    // Cleanup function
    return () => {
      if (call) {
        call.leave().catch((err) => console.error("Failed to leave call:", err));
        setCall(null);
      }
    };
  }, [videoClient, callId]);

  if (error) {
    return <ErrorCallUI error={error} />;
  }

  if (!call) {
    return <LoadingCallScreen message="Starting call..." />;
  }

  return (
    <StreamCall call={call}>
      <CallUI />
    </StreamCall>
  );
};

function CallUI() {
  const call = useCall();
  const router = useRouter();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const isCallCreatedByMe = call?.isCreatedByMe ?? false;

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      router.back();
    }
  }, [callingState, router]);

  switch (callingState) {
    case CallingState.UNKNOWN:
    case CallingState.IDLE:
      return <LoadingCallScreen message="Preparing call..." />;

    case CallingState.RINGING:
      return (
        <SafeAreaView style={styles.container}>
          {isCallCreatedByMe ? <OutgoingCall /> : <IncomingCall />}
        </SafeAreaView>
      );

    case CallingState.JOINING:
      return <LoadingCallScreen message="Joining call..." />;

    case CallingState.JOINED:
      return (
        <SafeAreaView style={styles.container}>
          <CallContent
            onHangupCallHandler={async (err) => {
              if (err) {
                console.error("Error hanging up:", err);
              }
              try {
                await call?.leave();
              } catch (error) {
                console.error("Failed to leave call:", error);
              }
            }}
            layout="spotlight"
          />
        </SafeAreaView>
      );

    case CallingState.LEFT:
      return null;

    case CallingState.RECONNECTING:
    case CallingState.MIGRATING:
      return <ReconnectingCallScreen />;

    case CallingState.RECONNECTING_FAILED:
      return (
        <ErrorCallUI error="Connection lost. Unable to reconnect. Please check your network and try again." />
      );

    case CallingState.OFFLINE:
      return (
        <ErrorCallUI error="No internet connection. Please check your network and try again." />
      );

    default:
      const exhaustiveCheck: never = callingState;
      throw new Error(`Unknown calling state: ${exhaustiveCheck}`);
  }
}

function LoadingCallScreen({ message }: { message: string }) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-4">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="mt-2 text-base text-foreground-muted">{message}</Text>
      </View>
    </SafeAreaView>
  );
}

function ReconnectingCallScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-4">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Ionicons name="cloud-offline-outline" size={48} color={COLORS.primary} />
        <Text className="mt-2 text-base text-foreground">Reconnecting...</Text>
        <Text className="text-sm text-foreground-muted">
          Please wait while we restore your connection
        </Text>
      </View>
    </SafeAreaView>
  );
}

function ErrorCallUI({ error }: { error: string }) {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.danger} />
        <Text className="mt-4 text-center text-lg font-semibold text-foreground">
          Call Failed
        </Text>
        <Text className="text-center text-base text-foreground-muted">
          {error}
        </Text>
        <Pressable
          className="mt-6 rounded-xl bg-primary px-8 py-4"
          onPress={() => router.back()}
        >
          <Text className="text-[16px] font-semibold text-foreground">
            Go Back
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CallScreen;