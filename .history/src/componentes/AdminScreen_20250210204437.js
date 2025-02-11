import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import axios from "axios";
import API_URL from "../../config";

const AdminScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("professor");

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        password,
        role,
      });
      Alert.alert("Sucesso", "Usuário registrado!");
    } catch (error) {
      Alert.alert("Erro", "Erro ao registrar o usuário");
    }
  };

  return (
    <View>
      <TextInput placeholder="Usuário" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput placeholder="Role" value={role} onChangeText={setRole} />
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
};

export default AdminScreen;
