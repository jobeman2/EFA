import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

interface Incident {
  id: string;
  title: string;
  description: string;
  type: string;
  photoUri?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  timestamp: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Incident[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem("incidentHistory");
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const renderItem = ({ item }: { item: Incident }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <MaterialIcons
          name={
            item.type === "Fire"
              ? "local-fire-department"
              : item.type === "Medical"
              ? "medical-services"
              : item.type === "Accident"
              ? "car-crash"
              : "report-problem"
          }
          size={24}
          color={COLORS.red}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
        {item.photoUri && (
          <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Incident History</Text>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="file-tray-outline" size={50} color={COLORS.textLight} />
          <Text style={styles.emptyText}>No incidents reported yet.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: COLORS.textDark,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.textDark,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textLight,
  },
});
