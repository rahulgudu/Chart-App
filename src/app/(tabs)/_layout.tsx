import { Ionicons } from "@expo/vector-icons";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import React from 'react';
const TabsLayout = () => {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <Label>Chats</Label>
                <Icon sf="safari" drawable="" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="explore">
                <Label>Explore</Label>
                <Icon sf="safari" drawable="explore" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="profile">
                <Label>Profile</Label>
                <Icon sf="safari" drawable="explore" />
            </NativeTabs.Trigger>
        </NativeTabs>
    )
}

export default TabsLayout