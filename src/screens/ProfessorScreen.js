import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfessorScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const API_URL = 'http://192.168.0.25:3000';
  const postsPerPage = 4;

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const professorId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');

        if (!professorId || !token) {
          Alert.alert('Erro', 'Não foi possível identificar o professor. Faça login novamente.');
          navigation.navigate('LoginScreen');
          return;
        }

        const response = await axios.get(`${API_URL}/posts/publicacoes/autor/${professorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error('Erro ao buscar publicações:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      setIsLoggedIn(false);
      navigation.navigate('HomeScreen');
      Alert.alert('Sucesso', 'Você foi desconectado!');
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
      Alert.alert('Erro', 'Não foi possível realizar o logout.');
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    setFilteredPosts(text ? posts.filter(post => post.titulo.toLowerCase().includes(text.toLowerCase()) || post.descricao.toLowerCase().includes(text.toLowerCase())) : posts);
  };

  const handleDelete = async (postId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${API_URL}/posts/publicacoes/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter(post => post._id !== postId));
      setFilteredPosts(filteredPosts.filter(post => post._id !== postId));
      Alert.alert('Sucesso', 'Post excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir post:', error.message);
      Alert.alert('Erro', 'Não foi possível excluir o post.');
    }
  };

  const handleEdit = (post) => {
    console.log('Clicou no botão editar para o post:', post); // Debug
    navigation.navigate('EditScreen', { post });
  };
  

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Posts do Professor 👨‍🏫</Text>
        {isLoggedIn ? (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 20 }}>
              <Icon name="sign-out" size={30} color="#007bff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CreatePostScreen')}>
              <Icon name="plus-circle" size={30} color="#007bff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
            <Icon name="user" size={30} color="#007bff" />
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={{ height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 20, paddingLeft: 10 }}
        placeholder="Buscar por título ou descrição"
        value={searchText}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : filteredPosts.length > 0 ? (
        <FlatList
          data={filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedPost(item === selectedPost ? null : item)}
              style={{ marginBottom: 15, padding: 10, borderBottomWidth: 1, backgroundColor: selectedPost && selectedPost._id === item._id ? '#e0e0e0' : 'transparent' }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.titulo}</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', paddingTop:5, paddingBottom:5 }}>Autor: {item.autor.name}</Text>
              <Text>{item.descricao.slice(0, 150)}...</Text>
              {selectedPost && selectedPost._id === item._id && (
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <TouchableOpacity onPress={() => handleEdit(item)} style={{ marginRight: 10 }}>
                    <Text style={{ color: '#007bff', fontWeight: 'bold' }}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Text style={{ color: '#ff0000', fontWeight: 'bold' }}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma publicação encontrada.</Text>
      )}
    </View>
  );
};

export default ProfessorScreen;
