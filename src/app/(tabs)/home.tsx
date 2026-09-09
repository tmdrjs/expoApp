import { useState } from "react";
import {
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
} from "react-native";

type SheetType = "arrival" | "departure" | null;

export default function HomeScreen() {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={styles.title}>홈</Text>
        <Text style={styles.description}>Description</Text>
        <View style={styles.btn}>
          <Pressable
            style={styles.airlineButton}
            onPress={() => setActiveSheet("arrival")}
          >
            <Text style={styles.arrivalAirport}>국가</Text>
          </Pressable>
          <Pressable
            style={styles.airlineButton}
            onPress={() => setActiveSheet("departure")}
          >
            <Text style={styles.departureAirport}>국가</Text>
          </Pressable>
        </View>
      </View>
      <Modal
        visible={activeSheet !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveSheet(null)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setActiveSheet(null)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          {activeSheet === "departure" && (
            <>
              <Text style={styles.sheetTitle}>출발 국가</Text>
              <Text style={styles.sheetBody}>
                여기에 출발 국가 관련 내용을 넣으세요.
              </Text>
            </>
          )}
          {activeSheet === "arrival" && (
            <>
              <Text style={styles.sheetTitle}>도착 국가</Text>
              <Text style={styles.sheetBody}>
                여기에 도착 국가 관련 내용을 넣으세요.
              </Text>
            </>
          )}
          <Pressable
            style={styles.closeButton}
            onPress={() => setActiveSheet(null)}
          >
            <Text style={styles.closeButtonText}>닫기</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#131313" },
  content: { flexGrow: 1, padding: 24, paddingTop: 100 },
  title: { fontSize: 36, fontWeight: "700", color: "white" },
  description: { fontSize: 18, fontWeight: "400", color: "white" },
  btn: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 30,
  },
  airlineButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  arrivalAirport: { color: "#000", fontSize: 16, fontWeight: "700" },
  departureAirport: { color: "#000", fontSize: 16, fontWeight: "700" },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#1c1c1c",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    minHeight: 260,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#444",
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  sheetBody: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    marginTop: 24,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});
