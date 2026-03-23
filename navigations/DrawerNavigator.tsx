// App.tsx or navigation/DrawerNavigator.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import HomeScreen from "@/screens/HomeScreen"; // your screen
import ProfileScreen from "@/screens/ProfileScreen";
import Header from "@/components/ui/Header";

const Drawer = createDrawerNavigator();

// Custom Drawer content
function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 20 }}>Menu</Text>
        <DrawerItem label="Home" onPress={() => props.navigation.navigate("Home")} />
        <DrawerItem label="Profile" onPress={() => props.navigation.navigate("Profile")} />
      </View>
    </DrawerContentScrollView>
  );
}

// Wrapper to include Header
function ScreenWrapper({ children, navigation, title }: any) {
  return (
    <View style={{ flex: 1 }}>
      <Header
        title={title}
        onMenuPress={() => navigation.openDrawer()}
        onProfilePress={() => navigation.navigate("Profile")}
      />
      {children}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="Home">
          {(props) => (
            <ScreenWrapper {...props} title="EFA">
              <HomeScreen />
            </ScreenWrapper>
          )}
        </Drawer.Screen>
        <Drawer.Screen name="Profile">
          {(props) => (
            <ScreenWrapper {...props} title="Profile">
              <ProfileScreen />
            </ScreenWrapper>
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
