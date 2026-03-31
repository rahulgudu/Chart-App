/* eslint-disable react-hooks/exhaustive-deps */
import { View, Text, Pressable, ActivityIndicator } from "react-native";
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

    const startcall = async () => {
      try {
        // find chanel  by ID to find its memebers
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
        console.error("Failed to start call: ", error);
        setError("Failed to start call. Please try again.");
      }
    };

    startcall();
  }, []);

  if (error) {
    return <ErrorCallUI error={error} />;
  }

  if (!call) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center gap-4">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="mt-2 text-base text-foreground-muted">
            Starting call...
          </Text>
        </View>
      </SafeAreaView>
    );
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
    if (callingState === CallingState.LEFT) router.back();
  }, [callingState, router, call]);

  // show ringing ui for ringing joining and IDLE states
  if (
    [CallingState.RINGING, CallingState.JOINING, CallingState.IDLE].includes(
      callingState,
    )
  ) {
    return (
      <SafeAreaView>
        {isCallCreatedByMe ? <OutgoingCall  /> : <IncomingCall />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <CallContent
        onHangupCallHandler={async () => {
          await call?.endCall();
        }}
        layout="spotlight"
      />
    </SafeAreaView>
  );
}

export default CallScreen;

function ErrorCallUI({ error }: { error: string }) {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-4">
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
        <Text className="mt-2 text-base text-foreground">{error}</Text>
        <Pressable
          className="mt-4 rounded-xl bg-primary px-6 py-3"
          onPress={() => router.back()}>
          <Text className="text-[15px] font-semibold text-foreground">
            Go Back
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
