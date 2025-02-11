import React, { useState, useEffect } from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import axios from "axios";
import API_URL from "../config"; // Importando a URL global

const AlunoScreen = ({ route }) => {
  const { token } = route.params; // Pegando o token passado na navegação
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/publicacoes`, {
          headers: {
            Authorization: `Bearer ${token}`, // Adicionando o token no cabeçalho
          },
        });

        setPosts(response.data);
      } catch (error) {
        console.log("Erro ao buscar publicações:", error.response?.data || error.message);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchPosts();
  }, [token]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Bem-vindo, Aluno!</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 15, padding: 10, borderBottomWidth: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.titulo || item.title}</Text>
              <Text>{item.descricao || item.content}</Text>
            </View>
          )}
          keyExtractor={(item) => item._id || item.id.toString()}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Nenhuma publicação encontrada.</Text>
      )}
    </View>
  );
};

export default AlunoScreen;
