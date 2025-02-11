import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import API_URL from "../config"; // Importando a URL global

const ReadingScreen = ({ route, navigation }) => {
  const { postId } = route.params; // Pega o postId que foi passado da HomeScreen
  console.log(postId);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/posts/publicacoes/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.log("Erro ao buscar o post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : post ? (
        <>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>{post.titulo}</Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", paddingTop: 10 }}>Autor: {post.autor.name}</Text>
          <Text style={{ marginTop: 20 }}>{post.descricao}</Text>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              padding: 10,
              backgroundColor: "#007bff",
              borderRadius: 5,
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#fff" }}>Voltar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Post não encontrado.</Text>
      )}
    </View>
  );
};

export default ReadingScreen;
