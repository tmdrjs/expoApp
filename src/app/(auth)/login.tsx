import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("로그인", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("로그인 실패", error.message);
      return;
    }

    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>F</Text>

        <Text style={styles.title}>로그인</Text>
        <Text style={styles.subtitle}>계정에 로그인해주세요.</Text>

        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            {loading ? "로그인 중..." : "로그인"}
          </Text>
        </Pressable>

        <View style={styles.bottomButtons}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.bottomText}>뒤로가기</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/(auth)/signup")}>
            <Text style={styles.bottomText}>회원가입</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 28,
  },

  logo: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 50,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    color: "#999",
    fontSize: 14,
    marginBottom: 30,
  },

  input: {
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 12,
  },

  loginButton: {
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  loginText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginTop: 24,
  },

  bottomText: {
    color: "#999",
    fontSize: 14,
  },
});
