import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";

type ScrollToTopButtonProps = {
  visible: boolean;
  onPress: () => void;
};

function ScrollToTopButton({ visible, onPress }: ScrollToTopButtonProps) {
  if (!visible) {
    return null;
  }

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});

const MemoizedScrollToTopButton = memo(ScrollToTopButton);
export default MemoizedScrollToTopButton;
export { MemoizedScrollToTopButton as ScrollToTopButton };
