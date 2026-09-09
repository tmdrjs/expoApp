import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const iconSets = { Ionicons, MaterialIcons };
type IconSetName = keyof typeof iconSets;
type TabMeta = { label: string; set: IconSetName; icon: string };
const TAB_META: Record<string, TabMeta> = {
  home: { label: "홈", set: "Ionicons", icon: "home-outline" },
  service: { label: "서비스", set: "Ionicons", icon: "grid-outline" },
  active: { label: "활동", set: "MaterialIcons", icon: "airplanemode-active" },
  account: { label: "계정", set: "Ionicons", icon: "person-outline" },
};

export default function CustomTabBar({ state, navigation }: any) {
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const tabWidth = containerWidth / state.routes.length;

  const moveIndicator = (index: number) => {
    if (containerWidth === 0) return;
    Animated.spring(translateX, {
      toValue: tabWidth * index,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  };

  // 컨테이너 폭이 처음 측정되거나, 화면 복귀 등으로 state.index가
  // 바뀔 때도 위치를 맞춰줌 (스와이프 뒤로가기 등 예외 케이스 대비)
  useEffect(() => {
    moveIndicator(state.index);
  }, [state.index, containerWidth]);

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safeArea}>
      <View style={styles.bar}>
        <View
          style={styles.tabs}
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
          {containerWidth > 0 && (
            <Animated.View
              style={[
                styles.indicator,
                {
                  width: tabWidth - 16,
                  transform: [{ translateX: Animated.add(translateX, 8) }],
                },
              ]}
            />
          )}
          {state.routes.map((route: any, index: number) => {
            const meta = TAB_META[route.name];
            if (!meta) return null;
            const isFocused = state.index === index;
            const IconComponent = iconSets[meta.set];

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              moveIndicator(index);

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={meta.label}
                onPress={onPress}
                style={({ pressed }) => [
                  styles.tab,
                  { opacity: pressed ? 0.5 : 1 },
                ]}
              >
                <IconComponent
                  name={meta.icon as any}
                  size={18}
                  color={isFocused ? "black" : "#8791a1"}
                />
                <Text style={[styles.label, isFocused && styles.active]}>
                  {meta.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#131313" },
  bar: {
    backgroundColor: "#2f2f2f",
    borderRadius: 40,
    marginHorizontal: 36,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
  tabs: { flexDirection: "row" },
  indicator: {
    position: "absolute",
    top: 7,
    bottom: 7,
    left: 0,
    backgroundColor: "#e0e4e8",
    borderRadius: 40,
  },
  label: { fontSize: 10, fontWeight: "600", color: "#8791a1" },
  active: { color: "black" },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 3,
  },
});
