import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { COLORS } from "@/constants/theme";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function ProfilePage() {
  const [name, setName] = useState("Nebil Usman");
  const [email, setEmail] = useState("nebil@example.com");
  const [phone, setPhone] = useState("+251 4665 12 00");
  const [emergencyContact, setEmergencyContact] = useState("+251 911 111 111");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState<string>("Fetching location...");

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocation("Location permission denied");
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(`Lat: ${loc.coords.latitude.toFixed(3)}, Lon: ${loc.coords.longitude.toFixed(3)}`);
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Notice", message);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    showToast("Profile updated!");
    // TODO: send profile data to backend
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar Section */}
      <View style={styles.avatarWrapper}>
        <Pressable onPress={pickAvatar} style={styles.avatarButton}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons name="person" size={64} color={COLORS.white} />
            </View>
          )}
          <View style={styles.editIcon}>
            <MaterialIcons name="edit" size={20} color={COLORS.white} />
          </View>
        </Pressable>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>

      {/* Info Section */}
      <View style={styles.card}>
        <InfoField label="Phone" value={phone} editable={isEditing} onChangeText={setPhone} />
        <InfoField
          label="Emergency Contact"
          value={emergencyContact}
          editable={isEditing}
          onChangeText={setEmergencyContact}
        />
        <InfoField label="Location" value={location} editable={false} />
      </View>

      {/* Actions */}
      <Pressable
        style={styles.primaryButton}
        onPress={isEditing ? handleSave : () => setIsEditing(true)}
      >
        <Text style={styles.primaryButtonText}>{isEditing ? "Save Changes" : "Edit Profile"}</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton}>
        <Ionicons name="time-outline" size={18} color={COLORS.red} />
        <Text style={styles.secondaryButtonText}>View Incident History</Text>
      </Pressable>

      <Pressable style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

function InfoField({
  label,
  value,
  editable,
  onChangeText,
}: {
  label: string;
  value: string;
  editable: boolean;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View style={styles.infoField}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.readonly]}
        value={value}
        editable={editable}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarButton: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.red,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.red,
    borderRadius: 12,
    padding: 6,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
    color: COLORS.textDark,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  infoField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  readonly: {
    backgroundColor: "#f5f5f5",
    color: COLORS.textDark,
  },
  primaryButton: {
    backgroundColor: COLORS.red,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.red,
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: COLORS.red,
    fontWeight: "600",
    marginLeft: 6,
  },
  logoutButton: {
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: COLORS.textLight,
    fontWeight: "600",
  },
});
