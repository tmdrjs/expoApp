import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ServicePage() {
  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        gap: 16,
        backgroundColor: "#131313",
        paddingTop: 100,
      }}
    >
      <Text style={styles.title}>서비스</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 36, fontWeight: "700", color: "white" },
});
