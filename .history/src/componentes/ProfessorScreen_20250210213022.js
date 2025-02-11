import React, { useState, useEffect } from "react";
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, TextInput, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../config"; // Importando a URL global

const ProfessorScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // Para armazenar os posts filtrados
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState(""); // Para armazenar o texto da busca
  const [selectedPost, setSelectedPost] = useState(null); // Para armazenar o post selecionado
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Verificar se o usuário está logado
  const postsPerPage = 4;

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true); // O professor está logado
      } else {
        setIsLoggedIn(false); // O professor não está logado
      }
    };

    checkLoginStatus(); // Verifica o status de login

    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Recupera o ID do professor e o token do AsyncStorage
        const professorId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        if (!professorId || !token) {
          Alert.alert("Erro", "Não foi possível identificar o professor. Faça login novamente.");
          navigation.navigate("LoginScreen");
          return;
        }

        // Faz a requisição para buscar os posts do professor logado
        const response = await axios.get(`${API_URL}/posts/publicacoes/autor/${professorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPosts(response.data);
        setFilteredPosts(response.data); // Inicialmente, mostra todos os posts
      } catch (error) {
        console.error("Erro ao buscar publicações:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Função para deslogar o usuário
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      setIsLoggedIn(false); // Atualiza o estado para indicar que o usuário não está mais logado
      navigation.navigate("HomeScreen"); // Redireciona para a tela home
      Alert.alert("Sucesso", "Você foi desconectado!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error.message);
      Alert.alert("Erro", "Não foi possível realizar o logout.");
    }
  };

  // Filtra os posts conforme o texto de busca
  const handleSearch = (text) => {
    setSearchText(text);

    if (text === "") {
      setFilteredPosts(posts); // Se a busca estiver vazia, mostra todos os posts
    } else {
      const filtered = posts.filter(
        (post) =>
          post.titulo.toLowerCase().includes(text.toLowerCase()) ||
          post.descricao.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  // Divisão dos posts conforme a página atual
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Função para lidar com a exclusão do post
  const handleDelete = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
      Alert.alert("Sucesso", "Post excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir post:", error.message);
      Alert.alert("Erro", "Não foi possível excluir o post.");
    }
  };

  // Função para lidar com a edição do post
  const handleEdit = (post) => {
    navigation.navigate("EditPostScreen", { post });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Posts do Professor 👨‍🏫</Text>

        {/* Exibir botão de logout ou login dependendo do estado */}
        {isLoggedIn ? (
          <View style={{ flexDirection: "row" }}>
            {/* Botão Logout */}
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 20 }}>
              <Icon name="sign-out" size={30} color="#007bff" />
            </TouchableOpacity>

            {/* Botão Criar Post */}
            <TouchableOpacity onPress={() => navigation.navigate("CreatePostScreen")}>
              <Icon name="plus-circle" size={30} color="#007bff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
            <Icon name="user" size={30} color="#007bff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Campo de busca */}
      <TextInput
        style={{
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 20,
          paddingLeft: 10,
        }}
        placeholder="Buscar por título ou descrição"
        value={searchText}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : currentPosts.length > 0 ? (
        <>
          <FlatList
            data={currentPosts}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedPost(item)}
                style={{
                  marginBottom: 15,
                  padding: 10,
                  borderBottomWidth: 1,
                  backgroundColor: selectedPost && selectedPost._id === item._id ? "#e0e0e0" : "transparent",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.titulo}</Text>
                <Text style={{ fontSize: 14, fontWeight: "bold", paddingTop: 5, paddingBottom: 5 }}>
                  Autor: {item.autor.name}
                </Text>
                <Text>{item.descricao.slice(0, 150)}...</Text>

                {/* Exibir botões de editar e excluir apenas se o post estiver selecionado */}
                {selectedPost && selectedPost._id === item._id && (
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={{ marginRight: 10 }}>
                      <Text style={{ color: "#007bff", fontWeight: "bold" }}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item._id)}>
                      <Text style={{ color: "#ff0000", fontWeight: "bold" }}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
        </>
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Nenhuma publicação encontrada.</Text>
      )}
    </View>
  );
};

export default ProfessorScreen;
