import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../../config";
import styles from "./styles";

const GerenciarProfessores = ({ navigation }) => {
  const [professores, setProfessores] = useState([]);

  useEffect(() => {
    const fetchProfessores = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await fetch(`${API_URL}/professores`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setProfessores(data);
      } catch (error) {
        console.error("Erro ao buscar professores:", error);
      }
    };

    fetchProfessores();
  }, []);

  const handleDelete = async (id) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await fetch(`${API_URL}/professores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfessores(professores.filter((prof) => prof._id !== id));
      Alert.alert("Sucesso", "Professor excluído com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o professor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Gerenciar Professores 👩‍🏫</Text>

      <TouchableOpacity onPress={() => navigation.navigate("CadastrarProfessor")} style={styles.addButton}>
        <Text style={styles.addButtonText}>➕ Adicionar Professor</Text>
      </TouchableOpacity>

      <FlatList
        data={professores}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item.name} - {item.disciplina}</Text>

            <View style={styles.listItemButtons}>
              <TouchableOpacity onPress={() => navigation.navigate("EditarProfessor", { professor: item })}>
                <Icon name="edit" size={20} color="#007bff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Icon name="trash" size={20} color="#ff0000" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default GerenciarProfessores;
