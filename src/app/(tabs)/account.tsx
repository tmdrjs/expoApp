import {
  Pressable,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error.message);
  }
};

export default function ServicePage() {
  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [dividerWidth, setDividerWidth] = useState(0);
  const charWidth = 8;
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

      setUserId(user.id);
      setEmail(user.email ?? "");
      setMemberSince(new Date(user.created_at).toLocaleDateString("ko-KR"));

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("nickname, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log(error.message);
        return;
      }

      setNickname(profile.nickname);
      setAvatarUrl(profile.avatar_url);
    };

    getProfile();
  }, []);

  const pickAndUploadPhoto = async () => {
    if (!userId) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "사진 접근 권한을 허용해주세요.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setUploading(true);

    try {
      const filePath = `${userId}/profile.jpg`;
      const arrayBuffer = decode(asset.base64!);

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "업로드 실패",
        error.message ?? "알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setUploading(false);
    }
  };

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
          <Pressable
            style={styles.profileImage}
            onPress={pickAndUploadPhoto}
            disabled={uploading}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.profilePhoto} />
            ) : (
              <Text style={styles.imageText}>PHOTO</Text>
            )}

            {uploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator color="#fff" size="small" />
              </View>
            )}
          </Pressable>

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
    backgroundColor: "#e2e5f5",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#e2e5f5",
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
    backgroundColor: "#b8bdd6",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  profilePhoto: {
    width: "100%",
    height: "100%",
  },

  uploadOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
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
    marginBottom: 100,
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
