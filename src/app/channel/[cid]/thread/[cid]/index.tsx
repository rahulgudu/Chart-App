import { EmptyState } from "@/src/components/EmptyState";
import { FullScreenLoader } from "@/src/components/FullScreenLoader";
import { useAppContext } from "@/src/contexts/AppProvider";
import { useHeaderHeight } from "@react-navigation/elements";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Channel, Thread } from "stream-chat-expo";

const ThreadScreen = () => {
  const { channel, thread, setThread } = useAppContext();
  const headerHeight = useHeaderHeight();

  if (channel === null) return <FullScreenLoader message="Loading thread..." />;

  // console.log(channel);

  if (!thread) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-surface">
        <Text className="text-white">No thread selected</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <Channel
        channel={channel}
        keyboardVerticalOffset={headerHeight}
        thread={thread}
        threadList
        EmptyStateIndicator={() => (
          <EmptyState
            icon="book-outline"
            title="No messages yet"
            subtitle="Start a study conversation!"
          />
        )}
      >
        <View className="flex-1 justify-start">
          <Thread onThreadDismount={() => setThread(null)} />
        </View>
      </Channel>
      {/* <Text className="text-white">Hii</Text> */}
    </SafeAreaView>
  );
};

export default ThreadScreen;
