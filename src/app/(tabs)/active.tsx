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
      <Text style={styles.title}>활동</Text>
      <View style={styles.container}>
        <Text style={styles.contents}>활동내역</Text>
        <Text style={styles.contents}>활동내역</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 36, fontWeight: "700", color: "white" },
  contents: { fontSize: 16, fontWeight: "500", color: "white" },
  container: { gap: 24 },
});
