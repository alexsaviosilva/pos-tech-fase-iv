import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_URL from "../../config"; // Caminho atualizado
import { Picker } from "@react-native-picker/picker";
import styles from "./styles"; // Importando os estilos

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("aluno"); // Estado para armazenar o papel do usuário

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });

      if (response.status === 200) {
        const { token, user } = response.data;

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("userId", user.id);
        await AsyncStorage.setItem("role", user.role);

        Alert.alert("Sucesso", "Login realizado com sucesso!");

        // Redireciona para a tela correta com base na seleção do role
        if (role === "aluno") {
          navigation.navigate("AlunoScreen", { token });
        } else if (role === "professor") {
          navigation.navigate("ProfessorScreen", { token });
        } else if (role === "admin") {
          navigation.navigate("AdminScreen", { token });
        } else {
          Alert.alert("Erro", "Role desconhecido. Contate o suporte.");
        }
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error.response?.data || error.message);
      Alert.alert("Erro", "Credenciais inválidas!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Picker
        selectedValue={role}
        style={styles.picker}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Aluno" value="aluno" />
        <Picker.Item label="Professor" value="professor" />
      </Picker>

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
