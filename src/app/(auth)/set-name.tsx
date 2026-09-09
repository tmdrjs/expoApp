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

export default function SetNameScreen() {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert("닉네임", "닉네임을 입력해주세요.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      Alert.alert("오류", "로그인 정보를 찾을 수 없습니다.");
      return;
    }

    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      nickname: nickname.trim(),
    });

    setLoading(false);

    if (error) {
      Alert.alert("오류", error.message);
      return;
    }

    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>F</Text>

        <Text style={styles.title}>닉네임 설정</Text>
        <Text style={styles.subtitle}>사용할 닉네임을 입력해주세요.</Text>

        <TextInput
          style={styles.input}
          placeholder="닉네임"
          placeholderTextColor="#999"
          value={nickname}
          onChangeText={setNickname}
          maxLength={20}
        />

        <Pressable
          style={styles.button}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "저장 중..." : "시작하기"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    width: "100%",
  },
  logo: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "800",
    marginBottom: 40,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#999",
    fontSize: 15,
    marginBottom: 28,
  },
  input: {
    height: 54,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#111",
    marginBottom: 14,
  },
  button: {
    height: 54,
    backgroundColor: "#fff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});
