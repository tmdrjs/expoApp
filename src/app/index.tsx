import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useEffect } from "react";

export default function LandingScreen() {
  const shadowX = useRef(new Animated.Value(10)).current;
  const shadowY = useRef(new Animated.Value(0)).current;

  const handleHoverIn = () => {
    Animated.loop(
      Animated.sequence([
        // 오른쪽
        Animated.parallel([
          Animated.timing(shadowX, {
            toValue: 10,
            duration: 0,
            useNativeDriver: false,
          }),
          Animated.timing(shadowY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ]),

        // 아래
        Animated.parallel([
          Animated.timing(shadowX, {
            toValue: 0,
            duration: 375,
            useNativeDriver: false,
          }),
          Animated.timing(shadowY, {
            toValue: 10,
            duration: 375,
            useNativeDriver: false,
          }),
        ]),

        Animated.parallel([
          Animated.timing(shadowX, {
            toValue: -10,
            duration: 375,
            useNativeDriver: false,
          }),
          Animated.timing(shadowY, {
            toValue: 0,
            duration: 375,
            useNativeDriver: false,
          }),
        ]),

        Animated.parallel([
          Animated.timing(shadowX, {
            toValue: 0,
            duration: 375,
            useNativeDriver: false,
          }),
          Animated.timing(shadowY, {
            toValue: -10,
            duration: 375,
            useNativeDriver: false,
          }),
        ]),

        Animated.parallel([
          Animated.timing(shadowX, {
            toValue: 10,
            duration: 375,
            useNativeDriver: false,
          }),
          Animated.timing(shadowY, {
            toValue: 0,
            duration: 375,
            useNativeDriver: false,
          }),
        ]),
      ]),
    ).start();
  };

  const handleHoverOut = () => {
    shadowX.stopAnimation();
    shadowY.stopAnimation();

    shadowX.setValue(0);
    shadowY.setValue(0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleHoverIn();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.logo}>F</Text>

        <Pressable
          onHoverIn={handleHoverIn}
          onHoverOut={handleHoverOut}
          onPressIn={handleHoverIn}
          onPress={() => router.push("/(auth)/login")}
          style={styles.primaryBtn}
        >
          <Animated.View
            style={[
              styles.shadow,
              {
                shadowOffset: {
                  width: shadowX,
                  height: shadowY,
                },
              },
            ]}
          />
          <Text style={styles.primaryBtnText}>여정</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    gap: 10,
    marginBottom: 64,
  },

  logo: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },

  primaryBtn: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 64,
    alignItems: "center",
    position: "relative",
  },

  primaryBtnText: {
    color: "black",
    fontSize: 16,
    fontWeight: "700",
  },

  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    borderRadius: 24,
    backgroundColor: "white",

    shadowColor: "#ffffff",
    shadowOpacity: 0.4,
    shadowRadius: 15,

    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});
