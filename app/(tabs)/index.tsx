import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import QuickActions from "@/components/home/QuickAction";
import LocationBadge from "@/components/home/LocationBadge";
import HelpButton from "@/components/home/HelpButton";
import LocationFetcher from "@/components/LocationFetcher";

const { width } = Dimensions.get("window");

const COLORS = {
  red: "#E84C3D",
  white: "#f7f7F7",
  textDark: "#1A1A1A",
  textLight: "#666",
  textBlue: "#202B5D",
};

let cachedCoords: { latitude: number; longitude: number } | null = null; // in-memory cache

export default function HomeScreen() {
  const router = useRouter();
  const pulse = useRef(new Animated.Value(1)).current;

  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(
    cachedCoords
  );
  const [loading, setLoading] = useState(!cachedCoords);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  const handleLocation = (location: { latitude: number; longitude: number }) => {
    cachedCoords = location; // cache in memory
    setCoords(location);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size="large" color={COLORS.red} />
            <Text style={{ textAlign: "center", marginTop: 8, color: COLORS.textLight }}>
              Loading location...
            </Text>
          </View>
        )}

        {/* Only render LocationFetcher if we don't have cached coords */}
        {!coords && <LocationFetcher onLocation={handleLocation} />}

        {/* Show location badge if we have coordinates */}
        {coords && (
          <LocationBadge
            username="Nebil"
            city="Addis Ababa"
            country="Ethiopia"
            latitude={coords.latitude}
            longitude={coords.longitude}
            onTopRightPress={() => console.log("Notification pressed")}
          />
        )}

        {/* Central HELP button */}
        <View style={styles.centerArea}>
          <View style={styles.ringOuter}>
            <View style={styles.ringMiddle}>
              <View style={styles.ringInner}>
                <HelpButton
                  onPress={() => {
                    console.log("HELP pressed, coordinates:", coords);
               
                  }}
                />
              </View>
            </View>
          </View>
          <Text style={styles.helpInfo}>
            Press HELP to instantly alert nearby responders with your location.
          </Text>
        </View>

        <QuickActions />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { paddingBottom: 120, alignItems: "center", backgroundColor: COLORS.white },
  centerArea: { justifyContent: "center", alignItems: "center", marginTop: 36, width: "100%" },
  ringOuter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.red,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 12,
  },
  ringMiddle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.red,
    justifyContent: "center",
    alignItems: "center",
  },
  ringInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  helpInfo: {
    marginTop: 20,
    paddingHorizontal: 40,
    textAlign: "center",
    fontSize: 15,
    color: COLORS.textLight,
    lineHeight: 20,
    fontFamily: "DMSansRegular",
  },
});
