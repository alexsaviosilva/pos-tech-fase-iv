import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../../config";
import styles from "./styles";

const CadastrarProfessor = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [disciplinas, setDisciplinas] = useState([]);

  // 🔄 Buscar disciplinas ao carregar a tela
  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          return;
        }

        const response = await fetch(`${API_URL}/disciplinas`.trim(), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao buscar disciplinas");

        const data = await response.json();
        setDisciplinas(data);
      } catch (error) {
        console.error("❌ Erro ao buscar disciplinas:", error);
        Alert.alert("Erro", "Falha ao carregar disciplinas.");
      }
    };

    fetchDisciplinas();
  }, []);

  // 💾 Função para salvar o professor no backend
  const handleSave = async () => {
    if (!name.trim() || !email.trim() || !disciplina) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const url = `${API_URL}/professores`.trim(); // 🔥 Garantindo que a URL está correta
      const requestData = {
        name,
        email,
        password: "123456",
        disciplina,
        role: "professor",
      };
      console.log("📩 Enviando payload:", JSON.stringify(requestData, null, 2));

      console.log("📩 Enviando requisição para:", url);
      console.log("📊 Payload enviado:", requestData);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Professor cadastrado com sucesso!");
        console.log("✅ Resposta do backend:", result);
        navigation.goBack();
      } else {
        console.error("❌ Erro ao cadastrar professor:", result);
        Alert.alert("Erro", result.message || `Erro ao cadastrar professor. Código: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Erro ao conectar com o backend:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o professor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Cadastrar Professor 👨‍🏫</Text>

      <View style={styles.formContainer}>
        {/* Nome */}
        <View style={styles.formRow}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Digite o nome"
          />
        </View>

        {/* E-mail */}
        <View style={styles.formRow}>
          <Text style={styles.inputLabel}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite o e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Picker Disciplina */}
        <View style={styles.formRow}>
          <Text style={styles.inputLabel}>Disciplina</Text>
          <Picker
            selectedValue={disciplina}
            onValueChange={(itemValue) => setDisciplina(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Selecione a disciplina" value="" />
            {disciplinas.length > 0 ? (
              disciplinas.map((disciplinaItem) => (
                <Picker.Item
                  key={disciplinaItem._id}
                  label={disciplinaItem.name}
                  value={disciplinaItem._id}
                />
              ))
            ) : (
              <Picker.Item label="Nenhuma disciplina encontrada" value="" />
            )}
          </Picker>
        </View>
      </View>

      {/* Botão de Salvar */}
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>💾 Salvar Professor</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CadastrarProfessor;
