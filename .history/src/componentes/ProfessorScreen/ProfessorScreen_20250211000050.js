import React, { useState, useEffect } from "react";
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, TextInput, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../../config"; // URL global
import styles from "./styles"; // Importando os estilos

const ProfessorScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // Posts filtrados
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); // Busca
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const postsPerPage = 4;

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const professorId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        if (!professorId || !token) {
          Alert.alert("Erro", "Faça login novamente.");
          navigation.navigate("LoginScreen");
          return;
        }

        const response = await axios.get(`${API_URL}/posts/publicacoes/autor/${professorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error("Erro ao buscar publicações:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      setIsLoggedIn(false);
      navigation.navigate("HomeScreen");
      Alert.alert("Sucesso", "Você foi desconectado!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar o logout.");
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.titulo.toLowerCase().includes(text.toLowerCase()) ||
          post.descricao.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
      Alert.alert("Sucesso", "Post excluído com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o post.");
    }
  };

  const handleEdit = (post) => {
    navigation.navigate("EditPostScreen", { post });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Posts do Professor 👨‍🏫</Text>

        {isLoggedIn ? (
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
              <Icon name="sign-out" size={30} color="#007bff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("CreatePostScreen")} style={styles.iconButton}>
              <Icon name="plus-circle" size={30} color="#007bff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")} style={styles.iconButton}>
            <Icon name="user" size={30} color="#007bff" />
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por título ou descrição"
        value={searchText}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : filteredPosts.length > 0 ? (
        <FlatList
          data={filteredPosts}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedPost(item)}
              style={[
                styles.postItem,
                selectedPost && selectedPost._id === item._id ? styles.selectedPost : {},
              ]}
            >
              <Text style={styles.postTitle}>{item.titulo}</Text>
              <Text style={styles.postAuthor}>Autor: {item.autor.name}</Text>
              <Text>{item.descricao.slice(0, 150)}...</Text>

              {selectedPost && selectedPost._id === item._id && (
                <View style={styles.postActions}>
                  <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                    <Text style={styles.editText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.actionButton}>
                    <Text style={styles.deleteText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text style={styles.noPostsText}>Nenhuma publicação encontrada.</Text>
      )}
    </View>
  );
};

export default ProfessorScreen;
