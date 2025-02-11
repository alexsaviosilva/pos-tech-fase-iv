import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_URL from "../../config"; 
import { Picker } from "@react-native-picker/picker";
import styles from "./styles"; 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("aluno"); 

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Erro", "Preencha todos os campos corretamente!");
      return;
    }

    try {
      console.log("📌 Tentando login com:", email.trim().toLowerCase(), "Role:", role);

      const response = await axios.post(`${API_URL}/auth/login`, { 
        email: email.trim().toLowerCase(), // Remove espaços e normaliza para minúsculas
        password,
        role
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("userId", user.id);
        await AsyncStorage.setItem("role", user.role);

        Alert.alert("Sucesso", "Login realizado com sucesso!");

        // Redireciona conforme o papel do usuário
        switch (user.role) {
          case "aluno":
            navigation.navigate("AlunoScreen", { token });
            break;
          case "professor":
            navigation.navigate("ProfessorScreen", { token });
            break;
          case "admin":
            navigation.navigate("AdminScreen", { token });
            break;
          default:
            Alert.alert("Erro", "Role desconhecido. Contate o suporte.");
        }
      }
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error.response?.data || error.message);
      Alert.alert("Erro", error.response?.data?.message || "Erro ao conectar ao servidor");
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
