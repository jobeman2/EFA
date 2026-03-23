import { Pressable, View, Text, StyleSheet, Dimensions, Linking, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants/theme";
const { width } = Dimensions.get("window");



export default function QuickActions() {
  const handlePress = (action: string) => {
    if (action === "call") {
      if (Platform.OS === "android") {
        // Android: direct call
        Linking.openURL("tel:937");
      } else {
        // iOS: open dialer with prompt
        Linking.openURL("telprompt:937");
      }
    } else {
      router.push(action);
    }
  };

  return (
    <View style={styles.quickActions}>
      {[
        { icon: "call", label: "Emergency Call", action: "call" },
        { icon: "alert-circle", label: "Report Incident", action: "/report" },
        { icon: "document-text", label: "My History", action: "/history" },
      ].map((item, i) => (
        <Pressable
          key={i}
          style={({ pressed }) => [
            styles.actionCard,
            pressed && { transform: [{ scale: 0.97 }] },
          ]}
          onPress={() => handlePress(item.action)}
        >
          <Ionicons name={item.icon as any} size={28} color={COLORS.red} />
          <Text style={styles.actionText}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 40,
    marginTop: 40,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 14,
    width: (width - 60) / 3,
    alignItems: "center",
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "DMSansLight",
    color: COLORS.textDark,
    textAlign: "center",
  },
});
