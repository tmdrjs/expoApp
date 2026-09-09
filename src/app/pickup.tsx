import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PickupScreen() {
  return (
    <SafeAreaView
      edges={["top", "left", "right", "bottom"]}
      style={styles.safeArea}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Pickup</Text>
        <Pressable style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeText}>닫기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7f8fa" },
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: { fontSize: 26, fontWeight: "700", color: "black" },
  closeBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#eff6ff",
    borderRadius: 10,
  },
  closeText: { color: "#2563eb", fontWeight: "600" },
});
