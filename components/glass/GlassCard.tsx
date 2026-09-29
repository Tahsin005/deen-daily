import { BlurView } from "expo-blur";
import { memo } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type GlassCardProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: "default" | "elevated" | "primaryTint" | "goldTint" | "muted";
  intensity?: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GlassCardComponent = ({
  children,
  style,
  contentStyle,
  onPress,
  variant = "default",
  intensity = 35,
}: GlassCardProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.985, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const variantStyle = styles[variant] || styles.default;

  const content = (
    <View style={[styles.cardOuter, variantStyle, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.topRimLight} pointerEvents="none" />
      <View style={[styles.contentContainer, contentStyle]}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.09)",
    borderTopColor: "rgba(255, 255, 255, 0.16)",
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 4,
    position: "relative",
  },
  topRimLight: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  contentContainer: {
    padding: 16,
    zIndex: 1,
  },
  default: {
    backgroundColor: "rgba(22, 28, 24, 0.65)",
  },
  elevated: {
    backgroundColor: "rgba(28, 36, 30, 0.78)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderTopColor: "rgba(255, 255, 255, 0.22)",
    shadowOpacity: 0.5,
  },
  primaryTint: {
    backgroundColor: "rgba(37, 103, 30, 0.18)",
    borderColor: "rgba(72, 161, 17, 0.28)",
    borderTopColor: "rgba(72, 161, 17, 0.45)",
  },
  goldTint: {
    backgroundColor: "rgba(242, 181, 11, 0.12)",
    borderColor: "rgba(242, 181, 11, 0.25)",
    borderTopColor: "rgba(242, 181, 11, 0.45)",
  },
  muted: {
    backgroundColor: "rgba(18, 22, 19, 0.5)",
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
});

export const GlassCard = memo(GlassCardComponent);
export default GlassCard;
