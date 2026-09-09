import { Stack, router, useSegments } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function RootNavigation() {
  const { session, loading } = useContext(AuthContext);
  const segments = useSegments();
  useEffect(() => {
    if (loading) return;

    const inAuth = segments[0] === "(auth)";
    const inTabs = segments[0] === "(tabs)";
    const isIndex = segments[0] === "home";

    if (session && inAuth && segments[1] !== "set-name") {
      router.replace("/(tabs)/home");
      return;
    }

    if (!session && inTabs) {
      router.replace("/(auth)/login");
    }
  }, [session, loading, segments]);

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="pickup" options={{ animation: "none" }} />
      </Stack>
    </View>
  );
}
