import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({  focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color="#89CFF0"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bucket-list"
        options={{
          title: "Bucket List",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "star" : "star-outline"}
              color="#D580FF"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="itinerary"
        options={{
          title: "Itinerary",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "calendar" : "calendar-outline"}
              color="#56bf52"
            />
          ),
        }}
      />
    </Tabs>
  );
}
