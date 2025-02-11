import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../../config"; // Importando a URL global

const CreatePostScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProfessor, setIsProfessor] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");
      const userId = await AsyncStorage.getItem("userId");
      console.log("userId:", userId);
      console.log("token:", token);

      if (token && role === "professor") {
        setIsProfessor(true);
      } else {
        setIsProfessor(false);
        Alert.alert("Erro", "Você não tem permissão para acessar esta página.");
        navigation.navigate("HomeScreen");
      }
    };

    checkRole();
  }, [navigation]);

  const handlePostSubmit = async () => {
    if (!titulo || !descricao) {
      Alert.alert("Erro", "Por favor, preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      const postData = {
        titulo,
        descricao,
        autor: userId,
        imagem,
      };

      const response = await axios.post(
        `${API_URL}/posts/publicacoes`, // Usando a URL global
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Sucesso", "Post criado com sucesso!", [
          {
            text: "OK",
            onPress: () => {
              setTitulo("");
              setDescricao("");
              setImagem("");
              navigation.navigate("ProfessorScreen");
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Erro ao criar o post:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível criar o post!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>Criar Novo Post</Text>

      <TextInput
        style={{
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 15,
          paddingLeft: 10,
        }}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        autoCorrect={false}
        spellCheck={false}
      />

      <TextInput
        style={{
          height: 100,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 15,
          paddingLeft: 10,
          textAlignVertical: "top",
        }}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        autoCorrect={false}
        spellCheck={false}
      />

      <TextInput
        style={{
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 15,
          paddingLeft: 10,
        }}
        placeholder="Imagem (URL ou nome do arquivo)"
        value={imagem}
        onChangeText={setImagem}
        autoCorrect={false}
        spellCheck={false}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity
          onPress={handlePostSubmit}
          style={{
            backgroundColor: "#007bff",
            padding: 15,
            borderRadius: 5,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#fff" }}>Cadastrar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CreatePostScreen;
