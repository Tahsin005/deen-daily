import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../../constants/Colors";

type BackButtonProps = {
  label?: string;
  onPress: () => void;
};

function BackButton({ label = "Back", onPress }: BackButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Ionicons name="arrow-back" size={16} color={Colors.light.primary} />
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E8F5E2",
    marginBottom: 12,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.primary,
  },
});

const MemoizedBackButton = memo(BackButton);
export default MemoizedBackButton;
export { MemoizedBackButton as BackButton };
