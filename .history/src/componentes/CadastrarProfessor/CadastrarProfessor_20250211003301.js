import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "./styles"; // Importando os estilos

const CadastrarProfessor = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [disciplina, setDisciplina] = useState("");

  const handleSave = async () => {
    if (!name || !email || !disciplina) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    // Chamar a API para salvar os dados (exemplo fictício)
    try {
      // Simulando o envio de dados
      console.log({ name, email, disciplina });

      // Caso seja bem-sucedido
      Alert.alert("Sucesso", "Professor cadastrado com sucesso!");
      navigation.goBack(); // Voltar para a tela anterior após salvar
    } catch (error) {
      console.error("Erro ao cadastrar professor:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o professor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Professor Cadastrador</Text>

      <View style={styles.formContainer}>
        <View style={styles.formRow}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Digite o nome"
          />
        </View>

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

        <View style={styles.formRow}>
          <Text style={styles.inputLabel}>Disciplina</Text>
          <TextInput
            style={styles.input}
            value={disciplina}
            onChangeText={setDisciplina}
            placeholder="Digite a disciplina"
          />
        </View>
      </View>

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CadastrarProfessor;
