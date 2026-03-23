import React, { useEffect, useState } from "react";
import { Animated, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface ToastProps {
  message: string;
  duration?: number; // milliseconds
  onHide?: () => void;
}

export default function Toast({ message, duration = 2000, onHide }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    // Fade out after duration
    const timeout = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setVisible(false);
        onHide?.();
      });
    }, duration);

    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: width * 0.05,
    width: width * 0.9,
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
