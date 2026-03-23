// LocationFetcher.tsx
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import * as Location from "expo-location";

interface Props {
  onLocation?: (coords: { latitude: number; longitude: number }) => void;
}

export default function LocationFetcher({ onLocation }: Props) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      onLocation?.(coords); // Pass coordinates to parent
    })();
  }, []);

  if (errorMsg) return <Text style={{ color: "red" }}>{errorMsg}</Text>;
  return null; 
}
