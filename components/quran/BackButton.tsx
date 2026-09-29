import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Fonts } from "../../constants/Fonts";

type BackButtonProps = {
  label?: string;
  onPress: () => void;
};

function BackButton({ label = "Back", onPress }: BackButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Ionicons name="arrow-back" size={16} color="#48A111" />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderTopColor: "rgba(255, 255, 255, 0.22)",
    marginBottom: 14,
  },
  text: {
    fontSize: Fonts.size.sm,
    fontWeight: "600",
    color: "#F3F4F6",
  },
});

export const MemoizedBackButton = memo(BackButton);
export default MemoizedBackButton;
export { MemoizedBackButton as BackButton };
