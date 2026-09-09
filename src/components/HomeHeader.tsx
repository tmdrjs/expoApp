import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeHeader() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        {/* <Text style={styles.title}>DAY 1</Text> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#131313" },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  title: {
    paddingTop: 10,
    fontSize: 26,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
  },
  pickupBtn: {
    alignSelf: "flex-start",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 36,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  pickupBtnText: { color: "black", fontWeight: "600" },
});
