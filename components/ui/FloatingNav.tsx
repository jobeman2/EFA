import React, { useCallback } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const LIGHT_BG = "#FFF";
const ACTIVE_COLOR = "#E84C3D";
const INACTIVE_COLOR = "#999";

const TABS = [
  { icon: "home-outline", route: "/" },
  { icon: "location-outline", route: "/explore" },
  { icon: "time-outline", route: "/history" },
  { icon: "person-outline", route: "/profile" },
];

function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  return (
    <View style={styles.container}>
      {TABS.map(({ icon, route }) => {
        const isActive =
          pathname === route || (route !== "/" && pathname.startsWith(route));
        const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

        return (
          <Pressable
            key={route}
            style={styles.item}
            onPress={() => handlePress(route)}
            android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }}
          >
            <Ionicons name={icon as any} size={22} color={color} />
          </Pressable>
        );
      })}
    </View>
  );
}

export default React.memo(BottomNav);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: LIGHT_BG,
    height: 64,
    
    borderTopColor: "#e0e0e0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  item: {
    alignItems: "center",
    flex: 1,
  },
});
