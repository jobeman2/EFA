import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  ToastAndroid,
  Alert,
  Image,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInUp,
  FadeIn,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { COLORS } from "@/constants/theme";

const INCIDENT_TYPES = [
  {
    label: "Fire",
    icon: <MaterialIcons name="local-fire-department" size={18} color={COLORS.red} />,
  },
  {
    label: "Accident",
    icon: <Ionicons name="car-sport" size={18} color={COLORS.red} />,
  },
  {
    label: "Medical",
    icon: <Ionicons name="medkit" size={18} color={COLORS.red} />,
  },
  {
    label: "Other",
    icon: <Ionicons name="alert-circle" size={18} color={COLORS.red} />,
  },
];

export default function ReportIncident() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(INCIDENT_TYPES[0].label);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Reanimated shared values
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoadingLocation(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      showToast("Permission to access location was denied");
      setLoadingLocation(false);
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setLoadingLocation(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Notice", message);
    }
  };

  const handleSubmit = () => {
    if (!title || !description) {
      showToast("Please fill in all fields");
      return;
    }

    const payload = {
      title,
      description,
      type,
      photoUri,
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    };

    console.log("Report payload:", payload);
    showToast("Incident reported successfully!");
    setTitle("");
    setDescription("");
    setType(INCIDENT_TYPES[0].label);
    setPhotoUri(null);
  };

  // Animated styles for button
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.Text
        entering={FadeInUp.duration(500)}
        style={styles.header}
      >
        Report an Incident
      </Animated.Text>

      {/* Incident Type Selector */}
      <View style={styles.typeContainer}>
        {INCIDENT_TYPES.map((t, index) => (
          <Animated.View
            key={t.label}
            entering={FadeInUp.delay(index * 100).springify()}
          >
            <Pressable
              style={[
                styles.typeButton,
                type === t.label && { backgroundColor: COLORS.red },
              ]}
              onPress={() => setType(t.label)}
            >
              <View style={styles.typeContent}>
                {React.cloneElement(t.icon, {
                  color: type === t.label ? COLORS.white : COLORS.red,
                })}
                <Text
                  style={[
                    styles.typeText,
                    type === t.label && { color: COLORS.white, fontWeight: "700" },
                  ]}
                >
                  {t.label}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={FadeInUp.delay(400)}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(500)}>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Description"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </Animated.View>

      {/* Photo Picker */}
      <Animated.View entering={FadeInUp.delay(600)}>
        <Pressable style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.photoButtonText}>
            {photoUri ? "Change Photo" : "Attach Photo"}
          </Text>
        </Pressable>
      </Animated.View>
      {photoUri && (
        <Animated.Image
          entering={FadeIn.delay(200)}
          source={{ uri: photoUri }}
          style={styles.photoPreview}
        />
      )}

      {/* Location Display */}
      <Animated.View entering={FadeInUp.delay(700)} style={styles.locationContainer}>
        <Text style={styles.locationText}>
          {loadingLocation
            ? "Fetching location..."
            : `Lat: ${latitude?.toFixed(4)}, Lon: ${longitude?.toFixed(4)}`}
        </Text>
        {!loadingLocation && (
          <Pressable onPress={fetchLocation}>
            <Text style={styles.refreshText}>Refresh</Text>
          </Pressable>
        )}
      </Animated.View>

      {/* Animated Submit Button */}
      <Animated.View entering={ZoomIn.delay(800)}>
        <Pressable
          onPressIn={() => (buttonScale.value = withSpring(0.95))}
          onPressOut={() => (buttonScale.value = withSpring(1))}
          style={styles.button}
          onPress={handleSubmit}
        >
          <Animated.Text style={[styles.buttonText, animatedButtonStyle]}>
            Submit Report
          </Animated.Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: COLORS.textDark,
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    marginBottom: 8,
  },
  typeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  typeText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  photoButton: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  photoButtonText: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  refreshText: {
    color: COLORS.red,
    fontWeight: "700",
  },
  button: {
    backgroundColor: COLORS.red,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
});
