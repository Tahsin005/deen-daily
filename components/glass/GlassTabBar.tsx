import Ionicons from "@expo/vector-icons/Ionicons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { memo } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fonts } from "../../constants/Fonts";

type IconName = keyof typeof Ionicons.glyphMap;

const tabIcons: Record<string, { active: IconName; inactive: IconName; label: string }> = {
  home: {
    active: "home",
    inactive: "home-outline",
    label: "Home",
  },
  prayer: {
    active: "moon",
    inactive: "moon-outline",
    label: "Prayer",
  },
  quran: {
    active: "book",
    inactive: "book-outline",
    label: "Quran",
  },
  hadith: {
    active: "library",
    inactive: "library-outline",
    label: "Hadith",
  },
  more: {
    active: "settings",
    inactive: "settings-outline",
    label: "More",
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TabItem = ({
  isFocused,
  routeName,
  onPress,
}: {
  isFocused: boolean;
  routeName: string;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const info = tabIcons[routeName] ?? {
    active: "ellipse",
    inactive: "ellipse-outline",
    label: routeName,
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.tabButton, animatedStyle]}
    >
      <View style={styles.tabContent}>
        <Ionicons
          name={isFocused ? info.active : info.inactive}
          size={20}
          color={isFocused ? "#48A111" : "#9CA3AF"}
        />
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
          {info.label}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

export const GlassTabBar = memo(({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === "android" ? 14 : 20);

  return (
    <View style={[styles.wrapper, { bottom: bottomInset }]} pointerEvents="box-none">
      <View style={styles.container}>
        <BlurView intensity={Platform.OS === "android" ? 40 : 60} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.topRim} pointerEvents="none" />

        <View style={styles.tabsRow}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const href = (options as any).href;
            if (href === null || route.name === "index") {
              return null;
            }

            const isFocused = state.index === index;

            const onPress = () => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {
                // Haptics fallback
              }

              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TabItem
                key={route.key}
                routeName={route.name}
                isFocused={isFocused}
                onPress={onPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "center",
    zIndex: 100,
  },
  container: {
    width: "100%",
    maxWidth: 480,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "rgba(14, 18, 15, 0.78)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderTopColor: "rgba(255, 255, 255, 0.22)",
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
  },
  topRim: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  tabsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: Fonts.size.xxs,
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: 2,
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    color: "#48A111",
    fontWeight: "700",
  },
});

GlassTabBar.displayName = "GlassTabBar";

export default GlassTabBar;
