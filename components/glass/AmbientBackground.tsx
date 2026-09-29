import { memo } from "react";
import { Image, StyleSheet, View } from "react-native";

const ambientGlowSource = require("../../assets/images/ambient-glow.png");

type AmbientBackgroundProps = {
  children?: React.ReactNode;
};

const AmbientBackgroundComponent = ({ children }: AmbientBackgroundProps) => {
  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Image
          source={ambientGlowSource}
          style={styles.ambientImage}
          resizeMode="cover"
          fadeDuration={0}
        />
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E0B", // Ultra-dark obsidian canvas
  },
  ambientImage: {
    width: "100%",
    height: "100%",
    opacity: 0.85,
  },
});

export const AmbientBackground = memo(AmbientBackgroundComponent);
export default AmbientBackground;
