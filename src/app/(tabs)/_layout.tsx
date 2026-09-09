import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import CustomTabBar from "@/components/CustomTabBar";
import HomeHeader from "@/components/HomeHeader";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f7f8fa" }}>
      <StatusBar style="light" />
      <Tabs
        initialRouteName="home"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          headerTitle: "DAY 1",
          headerBackButtonDisplayMode: "minimal",
          sceneStyle: { backgroundColor: "#f7f8fa" },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "홈",
            header: () => <HomeHeader />,
          }}
        />
        <Tabs.Screen name="service" options={{ title: "서비스" }} />
        <Tabs.Screen name="active" options={{ title: "활동" }} />
        <Tabs.Screen name="account" options={{ title: "계정" }} />
      </Tabs>
    </View>
  );
}
