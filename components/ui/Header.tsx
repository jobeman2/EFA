import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme"; // import centralized colors

interface HeaderProps {
  title?: string;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
}

const Header: React.FC<HeaderProps> = React.memo(
  ({ title = "EFA", onMenuPress, onProfilePress }) => {
    return (
      <View style={styles.container}>
        {/* Hamburger Menu */}
        <Pressable onPress={onMenuPress} style={styles.iconButton}>
          <MaterialIcons name="menu" size={28} color={COLORS.textDark} />
        </Pressable>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Profile Icon */}
        <Pressable onPress={onProfilePress} style={styles.profileButton}>
          <MaterialIcons name="person" size={24} color={COLORS.textDark} />
        </Pressable>
      </View>
    );
  }
);

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.bg,
    paddingTop: 40, // SafeArea padding for iOS
    paddingHorizontal: 20,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  iconButton: {
    padding: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    flex: 1,
  },
  profileButton: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
});
