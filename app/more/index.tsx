import { Text, View } from "react-native";
import { Colors } from "../../constants/Colors";

export default function MoreScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.light.background,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>More</Text>
      <Text style={{ fontSize: 16, color: "#666", marginTop: 8 }}>Settings and more tools.</Text>
    </View>
  );
}
