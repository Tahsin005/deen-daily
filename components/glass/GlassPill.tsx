import Ionicons from "@expo/vector-icons/Ionicons";
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

type GlassPillProps = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: "default" | "primary" | "gold";
  size?: "sm" | "md" | "lg";
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GlassPillComponent = ({
  label,
  icon,
  active = false,
  onPress,
  style,
  textStyle,
  variant = "default",
  size = "md",
}: GlassPillProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.94, { damping: 15, stiffness: 350 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 350 });
    }
  };

  const sizeStyle = styles[`size_${size}`];
  const textSizeStyle = styles[`textSize_${size}`];

  let activeOrVariantStyle = styles.default;
  let textColor = "#D1D5DB";
  let iconColor = "#9CA3AF";

  if (active || variant === "primary") {
    activeOrVariantStyle = styles.primary;
    textColor = "#FFFFFF";
    iconColor = "#48A111"; // Light green highlight
  } else if (variant === "gold") {
    activeOrVariantStyle = styles.gold;
    textColor = "#FDE68A";
    iconColor = "#F2B50B";
  }

  const content = (
    <View style={[styles.pill, sizeStyle, activeOrVariantStyle, style]}>
      {icon ? (
        <Ionicons
          name={icon}
          size={size === "sm" ? 14 : size === "lg" ? 18 : 16}
          color={iconColor}
          style={styles.icon}
        />
      ) : null}
      <Text style={[styles.text, textSizeStyle, { color: textColor }, textStyle]}>
        {label}
      </Text>
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
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    borderWidth: 1,
  },
  size_sm: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  size_md: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 6,
  },
  size_lg: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 8,
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
    letterSpacing: 0.2,
  },
  icon: {
    marginRight: 2,
  },
  default: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  primary: {
    backgroundColor: "rgba(37, 103, 30, 0.35)",
    borderColor: "rgba(72, 161, 17, 0.4)",
    borderTopColor: "rgba(72, 161, 17, 0.6)",
  },
  gold: {
    backgroundColor: "rgba(242, 181, 11, 0.16)",
    borderColor: "rgba(242, 181, 11, 0.35)",
    borderTopColor: "rgba(242, 181, 11, 0.55)",
  },
});

export const GlassPill = memo(GlassPillComponent);
export default GlassPill;
