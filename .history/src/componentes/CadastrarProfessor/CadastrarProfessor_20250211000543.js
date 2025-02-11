import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../../config";
import styles from "./styles";

const CadastrarProfessor = ({ navigation }) => {
  const [form, setForm] = useState({ name: "", email: "", disciplina: "" });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/professores`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, role: "professor" }),
      });

      const data = await response.json();
      Alert.alert("Sucesso", data.message);
      navigation.navigate("GerenciarProfessores");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar o professor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Cadastrar Professor</Text>

      <TextInput style={styles.input} placeholder="Nome" onChangeText={(text) => handleChange("name", text)} />
      <TextInput style={styles.input} placeholder="E-mail" onChangeText={(text) => handleChange("email", text)} />
      <TextInput style={styles.input} placeholder="Disciplina" onChangeText={(text) => handleChange("disciplina", text)} />

      <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CadastrarProfessor;
