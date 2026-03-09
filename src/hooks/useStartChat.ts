import { useRouter } from "expo-router";
import { Alert } from "react-native";
import type { StreamChat, Channel } from "stream-chat";
type UseStartChatParams = {
  client: StreamChat;
  userId: string;
  setChannel: (channel: Channel) => void;
  setCreating: (value: string | null) => void;
};
const useStartChat = ({
  client,
  userId,
  setChannel,
  setCreating,
}: UseStartChatParams) => {
  const router = useRouter();
  const handleStartChat = async (targetId: string) => {
    setCreating(targetId);
    try {
      const channel = client.channel("messaging", {
        members: [userId, targetId],
      });
      await channel.watch();

      setChannel(channel);

      // todo make this work later at some point
      //   router.push(`/channel/${channel.cid}`);
    } catch (error) {
      console.log("Error creating chat:", error);
      Alert.alert("Error", "Could not create chat. Please try again.");
    } finally {
      setCreating(null);
    }
  };
  return { handleStartChat };
};

export default useStartChat;
