import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { memo } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Fonts } from "../../constants/Fonts";

type GlassButtonProps = {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "secondary" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GlassButtonComponent = ({
  title,
  onPress,
  icon,
  variant = "primary",
  size = "md",
  style,
  textStyle,
  disabled = false,
}: GlassButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.96, { damping: 15, stiffness: 350 });
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics fallback
      }
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 350 });
    }
  };

  const variantStyle = styles[variant];
  const sizeStyle = styles[`size_${size}`];
  const textSizeStyle = styles[`textSize_${size}`];

  let textColor = "#FFFFFF";
  let iconColor = "#FFFFFF";

  if (variant === "secondary") {
    textColor = "#E5E7EB";
    iconColor = "#9CA3AF";
  } else if (variant === "gold") {
    textColor = "#FDE68A";
    iconColor = "#F2B50B";
  } else if (variant === "ghost") {
    textColor = "#9CA3AF";
    iconColor = "#9CA3AF";
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[animatedStyle, disabled && styles.disabled]}
    >
      <View style={[styles.button, sizeStyle, variantStyle, style]}>
        {icon ? (
          <Ionicons
            name={icon}
            size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
            color={iconColor}
            style={styles.icon}
          />
        ) : null}
        <Text style={[styles.text, textSizeStyle, { color: textColor }, textStyle]}>
          {title}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
  },
  size_sm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  size_md: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 8,
  },
  size_lg: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 10,
  },
  textSize_sm: {
    fontSize: Fonts.size.xs,
  },
  textSize_md: {
    fontSize: Fonts.size.sm,
  },
  textSize_lg: {
    fontSize: Fonts.size.text,
  },
  text: {
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  icon: {
    marginRight: 2,
  },
  primary: {
    backgroundColor: "#25671E", // Primary Dark Green
    borderColor: "rgba(72, 161, 17, 0.4)",
    borderTopColor: "rgba(72, 161, 17, 0.7)",
  },
  secondary: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderTopColor: "rgba(255, 255, 255, 0.25)",
  },
  gold: {
    backgroundColor: "rgba(242, 181, 11, 0.22)",
    borderColor: "rgba(242, 181, 11, 0.4)",
    borderTopColor: "rgba(242, 181, 11, 0.7)",
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  disabled: {
    opacity: 0.5,
  },
});

export const GlassButton = memo(GlassButtonComponent);
export default GlassButton;
