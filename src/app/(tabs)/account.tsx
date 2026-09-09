import {
  Pressable,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error.message);
  }
};

export default function ServicePage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [memberSince, setMemberSince] = useState("");

  const [dividerWidth, setDividerWidth] = useState(0);
  const charWidth = 8; // "<<" 두 글자 기준 대략적인 폭 (폰트 크기 14 기준, 필요시 조정)
  const repeatCount = Math.floor(dividerWidth / charWidth);

  const onDividerLayout = (e: LayoutChangeEvent) => {
    setDividerWidth(e.nativeEvent.layout.width);
  };

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setEmail(user.email ?? "");

      setMemberSince(new Date(user.created_at).toLocaleDateString("ko-KR"));

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log(error.message);
        return;
      }

      setNickname(profile.nickname);
    };

    getProfile();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        gap: 16,
        backgroundColor: "#131313",
        paddingTop: 100,
      }}
    >
      <Text style={styles.title}>계정</Text>
      <View style={styles.container}>
        <View style={styles.passportHeader}>
          <Text style={styles.passportTitle}>PASSPORT</Text>
          <Text style={styles.passportSub}>ACCOUNT</Text>
        </View>

        <View style={styles.profileSection}>
          {/* 프로필 사진 */}
          <View style={styles.profileImage}>
            <Text style={styles.imageText}>PHOTO</Text>
          </View>

          {/* 기본 정보 */}
          <View style={styles.info}>
            <View>
              <Text style={styles.label}>NAME</Text>
              <Text style={styles.value}>{nickname}</Text>
            </View>
            <View>
              <Text style={styles.label}>EMAIL</Text>
              <Text style={styles.value}>{email}</Text>
            </View>
            <View>
              <Text style={styles.label}>MEMBER SINCE</Text>
              <Text style={styles.value}>{memberSince}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} onLayout={onDividerLayout}>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="clip">
            PP
            {dividerWidth > 0 ? "<<".repeat(repeatCount) : ""}
          </Text>
        </View>

        <View style={styles.bottomInfo}>
          <View>
            <Text style={styles.label}>NATIONALITY</Text>
            <Text style={styles.value}>REPUBLIC OF KOREA</Text>
          </View>

          <View>
            <Text style={styles.label}>ID</Text>
            <Text style={styles.value}>F-000001</Text>
          </View>
        </View>
      </View>

      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 36, fontWeight: "700", color: "white" },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F0",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#D5D5D0",
  },

  passportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
  },

  passportTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#151515",
  },

  passportSub: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#777",
  },

  profileSection: {
    flexDirection: "row",
    gap: 20,
  },

  profileImage: {
    width: 105,
    height: 130,
    backgroundColor: "#D9D9D4",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  imageText: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
  },

  info: {
    flex: 1,
    justifyContent: "space-between",
  },

  label: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#888",
    marginBottom: 3,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },

  divider: {
    marginVertical: 20,
  },

  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoutButton: {
    marginTop: "auto",
    marginBottom: 30,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});
