import { QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GlassTabBar } from "../components/glass/GlassTabBar";
import { Colors } from "../constants/Colors";
import { queryClient } from "../lib/query/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: Colors.light.background }}
          edges={["top"]}
        >
          <StatusBar style="light" backgroundColor={Colors.light.background} />
          <Tabs
            tabBar={(props) => <GlassTabBar {...props} />}
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                position: "absolute",
                backgroundColor: "transparent",
                borderTopWidth: 0,
                elevation: 0,
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
              }}
            />
            <Tabs.Screen
              name="prayer"
              options={{
                title: "Prayer",
              }}
            />
            <Tabs.Screen
              name="quran"
              options={{
                title: "Quran",
              }}
            />
            <Tabs.Screen
              name="hadith"
              options={{
                title: "Hadith",
              }}
            />
            <Tabs.Screen
              name="more"
              options={{
                title: "More",
              }}
            />
          </Tabs>
        </SafeAreaView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
