import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Picker } from "react-native";
import styles from "./styles"; // Importando os estilos
import API_URL from "../../config";  // Configuração da URL da API

const CadastrarProfessor = ({ navigation }) => {
  const [name, setName] = useState("");  // Nome do professor
  const [email, setEmail] = useState("");  // E-mail do professor
  const [disciplina, setDisciplina] = useState("");  // Disciplina do professor
  const [disciplinas, setDisciplinas] = useState([]);  // Lista de disciplinas cadastradas

  // Função para buscar disciplinas cadastradas
  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const response = await fetch(`${API_URL}/disciplinas`);  // Requisição GET para obter as disciplinas
        const data = await response.json();
        setDisciplinas(data);  // Atualiza o estado com a lista de disciplinas
      } catch (error) {
        console.error("Erro ao buscar disciplinas:", error);
      }
    };
    fetchDisciplinas();  // Chama a função ao carregar o componente
  }, []);

  // Função para salvar o novo professor
  const handleSave = async () => {
    if (!name || !email || !disciplina) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/professores`, {  // Envia os dados do professor para o servidor
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          disciplina,
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

        {/* Campo Disciplina - Dropdown */}
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
                key={disciplinaItem.id}  // Usando ID como chave
                label={disciplinaItem.name}  // Nome da disciplina
                value={disciplinaItem.id}  // ID da disciplina
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Botão para Salvar o Professor */}
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CadastrarProfessor;
