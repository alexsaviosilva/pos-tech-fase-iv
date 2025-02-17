import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Picker } from "react-native";  // Usando Picker
import styles from "./styles";  // Certifique-se de que o arquivo de estilos está configurado
import API_URL from "../../config";  // URL da sua API

const CadastrarProfessor = ({ navigation }) => {
  const [name, setName] = useState("");  // Nome do professor
  const [email, setEmail] = useState("");  // E-mail do professor
  const [disciplina, setDisciplina] = useState("");  // Disciplina do professor
  const [disciplinas, setDisciplinas] = useState([]);  // Lista de disciplinas

  // Função para buscar as disciplinas cadastradas
  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const response = await fetch(`${API_URL}/disciplinas`);  // Supondo que você tenha uma rota para obter as disciplinas
        const data = await response.json();
        setDisciplinas(data);  // Armazena as disciplinas na lista
      } catch (error) {
        console.error("Erro ao buscar disciplinas:", error);
      }
    };
    fetchDisciplinas();  // Chama a função ao carregar a tela
  }, []);

  // Função para salvar o novo professor
  const handleSave = async () => {
    if (!name || !email || !disciplina) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      // Envia os dados para o backend via POST
      const response = await fetch(`${API_URL}/professores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          disciplina,  // Envia a disciplina selecionada
        }),
      });
      const result = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Professor cadastrado com sucesso!");
        navigation.goBack();  // Volta para a tela anterior após salvar
      } else {
        Alert.alert("Erro", result.message || "Erro ao cadastrar professor.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar professor:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o professor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Professor Cadastrador</Text>

      <View style={styles.formContainer}>
        {/* Campo Nome */}
        <View style={styles.formRow}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Digite o nome"
          />
        </View>

        {/* Campo E-mail */}
        <View style={styles.formRow}>
          <Text style={styles.inputLabel}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite o e-mail"
            keyboardType="email-address"
          />
        </View>

        {/* Campo Disciplina - Lista Suspensa */}
        <View style={styles.formRow}>
          <Text style={styles.inputLabel}>Disciplina</Text>
          <Picker
            selectedValue={disciplina}
            onValueChange={setDisciplina}
            style={styles.input}
          >
            <Picker.Item label="Selecione a disciplina" value="" />
            {disciplinas.map((disciplinaItem) => (
              <Picker.Item
                key={disciplinaItem.id}  // Certifique-se de que 'id' é a chave única
                label={disciplinaItem.name}  // Nome da disciplina
                value={disciplinaItem.id}  // ID da disciplina
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Botão para Salvar */}
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CadastrarProfessor;
