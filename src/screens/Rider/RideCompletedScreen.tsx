import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRiderStore } from "../../stores/useRiderStore";

export default function RideCompletedScreen() {
  const navigation = useNavigation<any>();
  const ride = useRiderStore((s) => s.currentRide);

  if (!ride) {
    return (
      <View style={styles.center}>
        <Text>Nenhuma corrida ativa.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Corrida concluída!</Text>

      <Text style={styles.label}>
        Motorista: {ride.driver?.name ?? "Desconhecido"}
      </Text>

      <Text style={styles.label}>
        Distância total: {ride.distance ? `${ride.distance} km` : "--"}
      </Text>

      <Text style={styles.label}>
        Preço final: {ride.finalPrice ? `${ride.finalPrice} CVE` : "--"}
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("RideRating")}
      >
        <Text style={styles.btnText}>Avaliar Motorista</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
