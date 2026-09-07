import { Stack, router, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const iconSets = { Ionicons, MaterialIcons };
type IconSetName = keyof typeof iconSets;
const tabs: {
  href: string;
  label: string;
  set: IconSetName;
  icon: string;
}[] = [
  { href: "/", label: "홈", set: "Ionicons", icon: "home-outline" },
  {
    href: "/page/service",
    label: "서비스",
    set: "Ionicons",
    icon: "grid-outline",
  },
  {
    href: "/active",
    label: "활동",
    set: "MaterialIcons",
    icon: "airplanemode-active",
  },
  { href: "/account", label: "계정", set: "Ionicons", icon: "person-outline" },
];

export default function RootLayout() {
  const pathname = usePathname();
  const activeTab = pathname.startsWith("/service")
    ? "/service"
    : pathname.startsWith("/active")
      ? "/active"
      : pathname.startsWith("/account")
        ? "/account"
        : "/";

  const activeIndex = tabs.findIndex((tab) => tab.href === activeTab);

  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const tabWidth = containerWidth / tabs.length;

  useEffect(() => {
    if (containerWidth === 0) return;
    Animated.spring(translateX, {
      toValue: tabWidth * activeIndex,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }, [activeIndex, containerWidth]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f8fa" }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          title: "DAY 1",
          headerBackButtonDisplayMode: "minimal",
          contentStyle: { backgroundColor: "#f7f8fa" },
        }}
      >
        <Stack.Screen options={{ title: "1" }} />
      </Stack>
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
                    width: tabWidth - 8,
                    transform: [{ translateX: Animated.add(translateX, 4) }],
                  },
                ]}
              />
            )}
            {tabs.map((tab) => {
              const IconComponent = iconSets[tab.set];

              return (
                <Pressable
                  key={tab.href}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: activeTab === tab.href }}
                  accessibilityLabel={tab.label}
                  onPress={() => router.replace(tab.href)}
                  style={({ pressed }) => [
                    styles.tab,
                    { opacity: pressed ? 0.5 : 1 },
                  ]}
                >
                  <IconComponent
                    name={tab.icon as any}
                    size={23}
                    color={activeTab === tab.href ? "#2563eb" : "#8791a1"}
                  />
                  <Text
                    style={[
                      styles.label,
                      activeTab === tab.href && styles.active,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "transparent",
  },
  bar: {
    backgroundColor: "#fff",
    borderRadius: 40,
    marginHorizontal: 36,
    marginBottom: 4,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 4,
  },
  tabs: { flexDirection: "row" },
  indicator: {
    position: "absolute",
    top: 6,
    bottom: 6,
    left: 1,
    backgroundColor: "#eff6ff",
    borderRadius: 40,
  },
  label: { fontSize: 12, fontWeight: "600", color: "#8791a1" },
  active: { color: "#2563eb" },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 3,
  },
});
