import { Stack } from "expo-router";
import Header from "@/components/ui/Header";
import FloatingNav from "@/components/ui/FloatingNav";
import { useFonts } from "expo-font";
import { View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans: require("../../assets/fonts/static/DMSans_18pt-Regular.ttf"),
    DMSansLight: require("../../assets/fonts/static/DMSans_18pt-Light.ttf"),
    DMSansRegular: require("../../assets/fonts/static/DMSans_18pt-Regular.ttf"),
    DMSansBold: require("../../assets/fonts/static/DMSans_18pt-Bold.ttf"),
  });

  if (!fontsLoaded) {
    // You could replace this with your SplashScreen or a simple loader
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  return (
    <>
      <Header title="EFA" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
        }}
      />
      <FloatingNav />
    </>
  );
}
