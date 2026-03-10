import { View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import { useAppContext } from "@/src/contexts/AppProvider";
import {
  Channel,
  MessageInput,
  MessageList,
  useChatContext,
} from "stream-chat-expo";
import { useNavigation, useRouter } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { FullScreenLoader } from "@/src/components/FullScreenLoader";
import { EmptyState } from "@/src/components/EmptyState";
import { COLORS } from "@/src/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

const ChannelScreen = () => {
  const { channel, setThread } = useAppContext();
  const { client } = useChatContext();

  const router = useRouter();
  const navigation = useNavigation();

  const headerHight = useHeaderHeight();

  let displayName = "";
  let avatarUrl = "";

  if (channel) {
    const members = Object.values(channel.state.members);
    const otherMembers = members.find(
      (member) => member.user_id !== client.userID,
    );

    displayName = otherMembers?.user?.name!;
    avatarUrl = otherMembers?.user?.image || "";
  }

  // useLayoutEffect vs useEffect
  // useLayout (sync) runs before the screen is painted, useEffect (async) runs after the screen is painted
  // so if we want to avoid flickering, we should use useLayoutEffect
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.surface,
      },
      headerTintColor: COLORS.text,
      headerLeft: () => {
        <TouchableOpacity
          onPress={() => router.back()}
          className="ml-2 flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>;
      },
      headerTitle: () => (
        <View className="flex-row items-center">
          {avatarUrl ? (
            <Image
              source={avatarUrl}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                marginRight: 10,
              }}
            />
          ) : (
            <View
              className="mr-2.5 h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="text-base font-semibold text-foreground">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text className="font-semibold text-foreground">{displayName}</Text>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // TODO: Implement video call functionality
          }}
        >
          <Ionicons name="videocam-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      ),
    });
  }, [displayName, navigation, router, avatarUrl, channel?.cid, channel?.id]);

  if (!channel) return <FullScreenLoader message="Loading messages...." />;
  return (
    <View className="flex-1 bg-border">
      <Channel
        channel={channel}
        keyboardVerticalOffset={headerHight}
        EmptyStateIndicator={() => (
          <EmptyState
            icon="book-outline"
            title="No messages yet"
            subtitle="Start a conversation"
          />
        )}
      >
        <MessageList
          onThreadSelect={(thread) =>
            router.push(`/channel/${channel.cid}/thread/${thread?.cid}`)
          }
        />

        <View className="pb-5 bg-surface">
          <MessageInput />
        </View>
      </Channel>
    </View>
  );
};

export default ChannelScreen;
