import { View, Text, Button } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sentry from "@sentry/react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { getGreetingForHour } from "@/src/lib/utils";
import { useAppContext } from "../../contexts/AppProvider";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/lib/theme";
import { TextInput } from "react-native-gesture-handler";
import { ChannelList } from "stream-chat-expo";
import type { Channel } from "stream-chat";
const ChatsScreen = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  const { user } = useUser();
  const firstName = user?.firstName || "Guest";

  const { setChannel } = useAppContext();
  const [search, setSearch] = useState("");

  const filters = { members: { $in: [user?.id!] }, type: "messaging" };

  const channelRenderFilterFn = (channels: Channel[]) => {
    if (!search.trim()) return channels;

    const q = search.toLowerCase();

    return channels.filter((channel) => {
      const name =
        (channel.data?.name as string | undefined)?.toLowerCase() ?? "";
      const cid = channel.cid.toLowerCase();
      return name.includes(q) || cid.includes(q);
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* HEADER */}
      <View className="px-5 pt-3 pb-2">
        <Text className="text-sm text-foreground-muted mb-0.5">
          {getGreetingForHour()}, {firstName}
        </Text>
      </View>

      {/* SEARCH BAR */}
      <View className="flex-row items-center bg-surface mx-5 mb-3 px-3.5 py-3 rounded-[14px] gap-2.5 border border-border">
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          className="flex-1 text-[15px] text-foreground"
          placeholder="Search your buddies..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* SECTION LABEL */}
      <View className="flex-row items-center px-5 my-1.5 gap-2">
        <Ionicons name="chatbubbles" size={16} color={COLORS.primaryLight} />
        <Text className="text-[15px] font-semibold text-primary-light">
          Your Chat Sessions
        </Text>
      </View>

      {/* Channel List  */}
      <ChannelList
        filters={filters}
        options={{ state: true, watch: true }}
        sort={{ last_updated: -1 }}
        channelRenderFilterFn={channelRenderFilterFn}
        onSelect={(channel) => {
          setChannel(channel);
          //router.push("/");
        }}
        additionalFlatListProps={{
          contentContainerStyle: { flexGrow: 1 },
        }}
      />
    </SafeAreaView>
  );
};

export default ChatsScreen;
