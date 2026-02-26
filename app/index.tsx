import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Deen Daily</Text>
      <Text style={{ fontSize: 16, color: "#666", marginTop: 8 }}>Your daily guide to Deen.</Text>
    </View>
  );
}
