import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView>
      <Text style={styles.heading}>헤더</Text>
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={styles.title}>제목</Text>
        <Text style={styles.description}>설명</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 32, fontWeight: "700", color: "black" },
  title: { fontSize: 26, fontWeight: "500", color: "black" },
  description: { fontSize: 18, fontWeight: "400", color: "black" },
});
