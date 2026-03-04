import { useAuth } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  if (!isLoaded) return null;
  if (!isSignedIn) {
    return <Redirect href={"/(auth)"} />;
  }
  return (
    <View>
      <Text className="text-red-500 text-4xl">Home Page</Text>
      <Link href={"/home"}>Home</Link>

      <Pressable onPress={() => signOut()}>
        <Text>Signout</Text>
      </Pressable>
    </View>
  );
}
