import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  Vibration,
  Text,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  red: "#D75A4F",
  white: "#FFFFFF",
};

interface HelpButtonProps {
  onPress?: (payload: any) => void;
  size?: number;
  holdDuration?: number; // milliseconds
  latitude?: number;
  longitude?: number;
}

export default function HelpButton({
  onPress,
  size = 180,
  holdDuration = 3000,
  latitude,
  longitude,
}: HelpButtonProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  const [countdown, setCountdown] = useState<number | null>(null);

  // breathing animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Alert", message);
    }
  };

  const handlePressIn = () => {
    setCountdown(holdDuration / 1000);

    let remaining = holdDuration / 1000;
    countdownInterval.current = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) setCountdown(remaining);
    }, 1000);

    holdTimeout.current = setTimeout(() => {
      Vibration.vibrate(500);

      // Prepare payload for backend
      const payload = {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
        type: "emergency",
      };

      console.log("Payload to backend:", payload);

      // Call optional onPress prop
      onPress?.(payload);

      // Show user-friendly message
      showToast("Emergency alert sent!");

      // Cleanup
      clearInterval(countdownInterval.current!);
      setCountdown(null);
      holdTimeout.current = null;
    }, holdDuration);
  };

  const handlePressOut = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
    setCountdown(null);
  };

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <Pressable
        style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: "rgba(255,255,255,0.2)" }}
      >
        <View
          style={[
            styles.ring,
            { width: size * 1.4, height: size * 1.4, borderRadius: (size * 1.4) / 2 },
          ]}
        />

        {countdown !== null ? (
          <Text style={[styles.countdownText, { fontSize: size / 3 }]}>{countdown}</Text>
        ) : (
          <Ionicons name="warning-outline" size={size / 2} color={COLORS.white} />
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.red,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.red,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 16,
  },
  ring: {
    position: "absolute",
    borderWidth: 6,
    borderColor: "rgba(215,90,79,0.4)",
    opacity: 0.6,
  },
  countdownText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});
