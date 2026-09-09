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

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("회원가입", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("회원가입 실패", error.message);
      return;
    }

    Alert.alert("회원가입 완료", "회원가입이 완료되었습니다.", [
      {
        text: "확인",
        onPress: () => router.replace("/(auth)/set-name"),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>F</Text>

        <Text style={styles.title}>회원가입</Text>
        <Text style={styles.subtitle}>새로운 계정을 만들어주세요.</Text>

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
          style={styles.signupButton}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.signupText}>
            {loading ? "가입 중..." : "회원가입"}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>로그인으로 돌아가기</Text>
        </Pressable>
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

  signupButton: {
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  signupText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  backText: {
    color: "#999",
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
  },
});
