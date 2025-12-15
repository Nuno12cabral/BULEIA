import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRiderStore } from "../../stores/useRiderStore";
import riderService from "../../services/riderService";

export default function RideRatingScreen() {
  const navigation = useNavigation<any>();
  const ride = useRiderStore((s) => s.currentRide);

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  async function submit() {
    if (!ride) return;

    if (rating === 0) {
      Alert.alert("Avaliação incompleta", "Selecione pelo menos 1 estrela.");
      return;
    }

    try {
      await riderService.rateDriver(ride.id, {
        stars: rating,
        comment: comment.slice(0, 500),
      });

      Alert.alert("Obrigado!", "Avaliação enviada com sucesso.");

      useRiderStore.getState().setCurrentRide(null);
      navigation.navigate("Home");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível enviar a avaliação.");
    }
  }

  function skip() {
    useRiderStore.getState().setCurrentRide(null);
    navigation.navigate("Home");
  }

  if (!ride) {
    return (
      <View style={styles.center}>
        <Text>Nenhuma corrida para avaliar.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Avaliar {ride.driver?.name ?? "Motorista"}
      </Text>

      {/* Estrelas */}
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((s) => (
          <TouchableOpacity key={s} onPress={() => setRating(s)}>
            <Text style={[styles.star, rating >= s && styles.starActive]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Comentário */}
      <TextInput
        placeholder="Comentário (opcional)"
        style={styles.input}
        value={comment}
        onChangeText={(t) => setComment(t.slice(0, 500))}
        multiline
      />

      <Text style={styles.counter}>{comment.length}/500</Text>

      {/* Enviar */}
      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>Enviar Avaliação</Text>
      </TouchableOpacity>

      {/* Pular */}
      <TouchableOpacity onPress={skip} style={styles.skip}>
        <Text style={styles.skipText}>Pular avaliação</Text>
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
    padding: 24,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  stars: {
    flexDirection: "row",
    marginBottom: 20,
  },
  star: {
    fontSize: 36,
    color: "#aaa",
    marginHorizontal: 6,
  },
  starActive: {
    color: "#FFD700",
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 8,
    minHeight: 100,
    marginBottom: 6,
  },
  counter: {
    fontSize: 12,
    color: "#888",
    marginBottom: 16,
    textAlign: "right",
  },
  btn: {
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  skip: {
    marginTop: 16,
    alignItems: "center",
  },
  skipText: {
    color: "#888",
    fontSize: 14,
  },
});
