import { Ionicons } from "@expo/vector-icons";
import { QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GlobalLoader } from "../components/common/GlobalLoader";
import { Colors } from "../constants/Colors";
import { queryClient } from "../lib/query/queryClient";

const iconSize = 22;

export default function RootLayout() {
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const triggerOverlay = useCallback(() => {
    setShowOverlay(true);
    overlayOpacity.stopAnimation();
    overlayOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 260,
        delay: 260,
        useNativeDriver: true,
      }),
    ]).start(() => setShowOverlay(false));
  }, [overlayOpacity]);

  const tabListeners = useMemo(
    () => ({
      tabPress: () => {
        triggerOverlay();
      },
    }),
    [triggerOverlay]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }} edges={["top"]}>
          <StatusBar style="dark" backgroundColor={Colors.light.background} />
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
              listeners={tabListeners}
            />
            <Tabs.Screen
              name="prayer"
              options={{
                title: "Prayer",
                tabBarIcon: ({ color }) => <Ionicons name="moon" size={iconSize} color={color} />,
              }}
              listeners={tabListeners}
            />
            <Tabs.Screen
              name="quran"
              options={{
                title: "Quran",
                tabBarIcon: ({ color }) => <Ionicons name="book" size={iconSize} color={color} />,
              }}
              listeners={tabListeners}
            />
            <Tabs.Screen
              name="hadith"
              options={{
                title: "Hadith",
                tabBarIcon: ({ color }) => <Ionicons name="library" size={iconSize} color={color} />,
              }}
              listeners={tabListeners}
            />
            <Tabs.Screen
              name="more"
              options={{
                title: "More",
                tabBarIcon: ({ color }) => <Ionicons name="settings" size={iconSize} color={color} />,
              }}
              listeners={tabListeners}
            />
          </Tabs>
          {showOverlay ? (
            <Animated.View
              pointerEvents="none"
              style={[styles.overlay, { opacity: overlayOpacity }]}
            >
              <GlobalLoader size={120} />
            </Animated.View>
          ) : null}
        </SafeAreaView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
