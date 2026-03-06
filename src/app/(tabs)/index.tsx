import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Sentry from "@sentry/react-native"
import { useAuth } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
const ChatsScreen = () => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }
  return (
    <SafeAreaView>
      <Button title='Try!' onPress={() => { Sentry.captureException(new Error('First error')) }} />
      <Text>ChatsScreen</Text>
    </SafeAreaView>
  )
}

export default ChatsScreen