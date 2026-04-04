import { FullScreenLoader } from "@/src/components/FullScreenLoader";
import { useAppContext } from "@/src/contexts/AppProvider";
import { COLORS } from "@/src/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Channel,
  MessageInput,
  MessageList,
  useChatContext,
} from "stream-chat-expo";

const ChannelScreen = () => {
  const insets = useSafeAreaInsets();
  const { channel, setThread } = useAppContext();
  const { client } = useChatContext();
  const router = useRouter();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  // For Samsung/Android, we often need a slight positive offset
  // to account for the system nav bar being pushed up.
  const keyboardOffset = Platform.OS === "ios" ? headerHeight : 30;

  let displayName = "";
  let avatarUrl = "";

  if (channel) {
    const members = Object.values(channel.state.members);
    const otherMember = members.find((m) => m.user_id !== client.userID);
    displayName = otherMember?.user?.name || "User";
    avatarUrl = otherMember?.user?.image || "";
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: COLORS.surface },
      headerTintColor: COLORS.text,
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} className="ml-2">
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
      ),
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
              style={{ backgroundColor: COLORS.primary }}>
              <Text className="text-white">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text className="font-semibold text-foreground">{displayName}</Text>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          className="mr-4"
          onPress={() =>
            router.push({
              pathname: "/call/[callId]",
              params: { callId: channel?.id! },
            })
          }>
          <Ionicons name="videocam-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, displayName, avatarUrl, channel?.id, router]);

  if (!channel) return <FullScreenLoader message="Loading..." />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Channel channel={channel} keyboardVerticalOffset={keyboardOffset}>
        <View style={{ flex: 1 }}>
          <MessageList
            onThreadSelect={(thread) => {
              setThread(thread);
              router.push(`/channel/${channel.cid}/thread/${thread?.cid}`);
            }}
          />
        </View>

        {/* Using KeyboardAvoidingView manually is often more reliable 
          for Samsung devices than Stream's internal logic.
        */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={keyboardOffset}>
          <View
            style={{
              paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
              backgroundColor: COLORS.surface,
              borderTopWidth: 1,
              borderTopColor: COLORS.border,
            }}>
            <MessageInput audioRecordingEnabled />
          </View>
        </KeyboardAvoidingView>
      </Channel>
    </View>
  );
};

export default ChannelScreen;
