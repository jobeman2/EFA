import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { COLORS } from "@/constants/theme";

interface LocationBadgeProps {
  username?: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  onTopRightPress?: () => void;
}

export default function LocationBadge({
  username = "Nebil",
  city,
  country,
  latitude,
  longitude,
  onTopRightPress,
}: LocationBadgeProps) {
  // Shared values for animation
  const translateY = useSharedValue(-40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animate in when component mounts
    opacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    translateY.value = withSpring(0, { damping: 12, stiffness: 120 });
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.card, animatedCardStyle]}>
      <View style={styles.topRow}>
        <Text style={styles.greeting}>Hello, {username}</Text>
        <Pressable onPress={onTopRightPress} style={styles.iconWrapper}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.red} />
        </Pressable>
      </View>

      <View style={styles.locationContainer}>
        <MaterialIcons name="location-pin" size={24} color={COLORS.red} />
        <View style={styles.locationInfo}>
          <Text style={styles.city}>
            {city}, {country}
          </Text>
          {latitude !== undefined && longitude !== undefined && (
            <Text style={styles.coords}>
              Lat: {latitude.toFixed(2)}, Lon: {longitude.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  card: {
    width: width - 32,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.0,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    fontFamily: "DMSansBold",
  },
  iconWrapper: {
    padding: 6,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationInfo: {
    marginLeft: 12,
  },
  city: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    fontFamily: "DMSansSemiBold",
  },
  coords: {
    fontSize: 13,
    color: COLORS.textLight,
    fontFamily: "DMSansRegular",
    marginTop: 2,
  },
});
