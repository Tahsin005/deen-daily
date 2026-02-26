import { Ionicons } from "@expo/vector-icons";
import { QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { Colors } from "../constants/Colors";
import { queryClient } from "../lib/query/queryClient";

const iconSize = 22;

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.light.tabIconSelected,
          tabBarInactiveTintColor: Colors.light.tabIconDefault,
          tabBarStyle: {
            backgroundColor: Colors.light.background,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Ionicons name="home" size={iconSize} color={color} />,
          }}
        />
        <Tabs.Screen
          name="prayer"
          options={{
            title: "Prayer",
            tabBarIcon: ({ color }) => <Ionicons name="moon" size={iconSize} color={color} />,
          }}
        />
        <Tabs.Screen
          name="quran"
          options={{
            title: "Quran",
            tabBarIcon: ({ color }) => <Ionicons name="book" size={iconSize} color={color} />,
          }}
        />
        <Tabs.Screen
          name="hadith"
          options={{
            title: "Hadith",
            tabBarIcon: ({ color }) => <Ionicons name="library" size={iconSize} color={color} />,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: "More",
            tabBarIcon: ({ color }) => <Ionicons name="settings" size={iconSize} color={color} />,
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}
