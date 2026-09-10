import { useState } from "react";
import {
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Platform } from "react-native";
import MapView from "react-native-maps";
import { supabase } from "@/lib/supabase";

type AirportType = "arrival" | "departure" | null;

type Airport = {
  id: number;
  country_code: string;
  airport_name: string;
  iata_code: string;
  icao_code: string | null;
};

export default function HomeScreen() {
  const [activeAirport, setActiveAirport] = useState<AirportType>(null);

  const [departureAirport, setDepartureAirport] = useState<Airport | null>(
    null,
  );

  const [arrivalAirport, setArrivalAirport] = useState<Airport | null>(null);

  const [airports, setAirports] = useState<Airport[]>([]);
  const [loadingAirports, setLoadingAirports] = useState(false);
  const [searchText, setSearchText] = useState("");

  // 전체 공항 불러오기
  const loadAirports = async () => {
    setLoadingAirports(true);

    try {
      const allAirports: Airport[] = [];
      const pageSize = 1000;

      let from = 0;

      while (true) {
        const { data, error } = await supabase
          .from("airports")
          .select("id, country_code, airport_name, iata_code, icao_code")
          .order("airport_name")
          .range(from, from + pageSize - 1);

        if (error) {
          console.error("공항 불러오기 실패:", error);
          Alert.alert("오류", `공항을 불러오지 못했습니다.\n${error.message}`);
          return;
        }

        if (!data || data.length === 0) {
          break;
        }

        allAirports.push(...data);

        if (data.length < pageSize) {
          break;
        }

        from += pageSize;
      }

      console.log(`불러온 공항 수: ${allAirports.length}`);

      setAirports(allAirports);
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "공항을 불러오는 중 문제가 발생했습니다.");
    } finally {
      setLoadingAirports(false);
    }
  };

  const openAirportSelector = async (type: "departure" | "arrival") => {
    setActiveAirport(type);
    setSearchText("");

    if (airports.length === 0) {
      await loadAirports();
    }
  };

  const filteredAirports = airports.filter((airport) => {
    const keyword = searchText.toLowerCase().trim();

    if (!keyword) {
      return true;
    }

    return (
      airport.airport_name.toLowerCase().includes(keyword) ||
      airport.iata_code.toLowerCase().includes(keyword) ||
      airport.country_code.toLowerCase().includes(keyword)
    );
  });

  const selectAirport = (airport: Airport) => {
    if (activeAirport === "departure") {
      setDepartureAirport(airport);
    } else if (activeAirport === "arrival") {
      setArrivalAirport(airport);
    }

    setActiveAirport(null);
    setSearchText("");
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType={Platform.OS === "ios" ? "hybridFlyover" : "standard"}
        initialRegion={{
          latitude: 37.5665,
          longitude: 126.978,
          latitudeDelta: 40,
          longitudeDelta: 40,
        }}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>홈</Text>

        <Text style={styles.description}>항공편을 검색해보세요.</Text>

        {/* 출발 / 도착 공항 */}
        <View style={styles.btn}>
          {/* 출발 공항 */}
          <Pressable
            style={({ pressed }) => [
              styles.airportButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => openAirportSelector("departure")}
          >
            <View style={styles.airportButtonContent}>
              <Text style={styles.buttonLabel}>출발</Text>

              <Text
                style={
                  departureAirport
                    ? styles.airportTextSelected
                    : styles.airportText
                }
                numberOfLines={1}
              >
                {departureAirport
                  ? `${departureAirport.airport_name} (${departureAirport.iata_code})`
                  : "공항 선택"}
              </Text>
            </View>
          </Pressable>

          {/* 도착 공항 */}
          <Pressable
            style={({ pressed }) => [
              styles.airportButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => openAirportSelector("arrival")}
          >
            <View style={styles.airportButtonContent}>
              <Text style={styles.buttonLabel}>도착</Text>

              <Text
                style={
                  arrivalAirport
                    ? styles.airportTextSelected
                    : styles.airportText
                }
                numberOfLines={1}
              >
                {arrivalAirport
                  ? `${arrivalAirport.airport_name} (${arrivalAirport.iata_code})`
                  : "공항 선택"}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={activeAirport !== null}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setActiveAirport(null);
          setSearchText("");
        }}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            setActiveAirport(null);
            setSearchText("");
          }}
        />

        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <Text style={styles.sheetTitle}>
            {activeAirport === "departure"
              ? "출발 공항 선택"
              : "도착 공항 선택"}
          </Text>

          {/* 검색 */}
          <TextInput
            style={styles.searchInput}
            placeholder="공항명 또는 IATA 코드 검색"
            placeholderTextColor="#777"
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {loadingAirports ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>공항을 불러오는 중...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.resultCount}>
                {filteredAirports.length.toLocaleString()}개 공항
              </Text>

              <ScrollView
                style={styles.airportList}
                showsVerticalScrollIndicator={false}
              >
                {filteredAirports.map((airport) => (
                  <Pressable
                    key={airport.id}
                    style={({ pressed }) => [
                      styles.option,
                      { opacity: pressed ? 0.5 : 1 },
                    ]}
                    onPress={() => selectAirport(airport)}
                  >
                    <View style={styles.optionContent}>
                      <Text style={styles.optionText} numberOfLines={1}>
                        {airport.airport_name}
                      </Text>

                      <Text style={styles.optionSubText}>
                        {airport.iata_code}
                        {airport.country_code
                          ? ` · ${airport.country_code}`
                          : ""}
                      </Text>
                    </View>
                  </Pressable>
                ))}

                {filteredAirports.length === 0 && (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                  </View>
                )}
              </ScrollView>
            </>
          )}

          <Pressable
            style={styles.closeButton}
            onPress={() => {
              setActiveAirport(null);
              setSearchText("");
            }}
          >
            <Text style={styles.closeButtonText}>닫기</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  overlay: {
    flex: 1,
    padding: 24,
    paddingTop: 100,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },

  description: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },

  btn: {
    flexDirection: "row",
    gap: 12,
    marginTop: 500,
    marginBottom: 12,
  },

  airportButton: {
    flex: 1,
    height: 70,
    borderRadius: 14,
    backgroundColor: "#2f2f2f",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  airportButtonContent: {
    flex: 1,
    marginRight: 8,
  },

  buttonLabel: {
    color: "#8791a1",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },

  airportText: {
    color: "#8791a1",
    fontSize: 15,
    fontWeight: "600",
  },

  airportTextSelected: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },

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
    maxHeight: "85%",
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
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  searchInput: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#292929",
    paddingHorizontal: 16,
    color: "#fff",
    fontSize: 15,
    marginBottom: 12,
  },

  resultCount: {
    color: "#777",
    fontSize: 13,
    marginBottom: 10,
  },

  airportList: {
    maxHeight: 430,
  },

  option: {
    minHeight: 60,
    borderRadius: 12,
    backgroundColor: "#292929",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
  },
  optionSubText: {
    color: "#888",
    fontSize: 13,
    marginTop: 4,
  },

  loadingContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#888",
    marginTop: 12,
    fontSize: 14,
  },

  emptyContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#777",
    fontSize: 14,
  },

  closeButton: {
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  closeButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
