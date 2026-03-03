import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Home() {
    const { isSignedIn } = useAuth();
    if (!isSignedIn) {
        return <Redirect href={"/(auth)"} />
    }
    return <View>
        <Text className="text-red-500 text-4xl">Home Page</Text>
    </View>
}