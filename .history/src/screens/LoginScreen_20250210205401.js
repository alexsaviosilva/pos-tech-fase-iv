import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_URL from "../../config"; // Importando a URL global

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });

      if (response.status === 200) {
        const { token, user } = response.data; // Pegamos o token e o usuário retornado pela API

        // Salve o token, userId e role no AsyncStorage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("userId", user.id); // Salve o userId também
        await AsyncStorage.setItem("role", user.role); // Agora estamos salvando o role também

        Alert.alert("Sucesso", "Login realizado com sucesso!");

        // Redirecionando para a tela correta conforme o role
        if (user.role === "aluno") {
          navigation.navigate("AlunoScreen", { token });
        } else if (user.role === "professor") {
          navigation.navigate("ProfessorScreen", { token });
        } else if (user.role === "admin") {
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

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { height: 40, borderBottomWidth: 1, marginBottom: 20, paddingHorizontal: 10 },
});

export default LoginScreen;
