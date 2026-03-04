import { Redirect, Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

export default function AuthRoutesLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    <Redirect href="/(auth)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}