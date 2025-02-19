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
      // Atualiza os posts depois de excluir
      const updatedPosts = posts.filter(post => post._id !== postId);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      Alert.alert('Sucesso', 'Post excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir post:', error.message);
      Alert.alert('Erro', 'Não foi possível excluir o post.');
    }
  };

  const handleEdit = (post) => {
    navigation.navigate('EditScreen', { post });
  };

  const handleCreate = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]); // Adiciona o novo post no começo da lista
    setFilteredPosts(prevPosts => [newPost, ...prevPosts]); // Também adiciona no filtro
  };

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePagination = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Posts do Professor 👨‍🏫</Text>
        {isLoggedIn ? (
          <View style={{ flexDirection: 'row' }}>
            
            <TouchableOpacity onPress={() => navigation.navigate('CreatePostScreen', { onCreate: handleCreate })} style={{ marginRight: 30 }}> {/* Aumentei o marginRight */}
              <Icon name="plus-circle" size={30} color="#007bff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('UserScreen')} style={{ marginRight: 30 }}  >
              <Icon name="user-plus" size={30} color="#007bff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}> {/* Aumentei o marginRight */}
              <Icon name="sign-out" size={30} color="#007bff" />
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
              onPress={() => setSelectedPost(item === selectedPost ? null : item)}  // Toggle seleção do post
              style={{ marginBottom: 15, padding: 10, borderBottomWidth: 1, backgroundColor: selectedPost && selectedPost._id === item._id ? '#e0e0e0' : 'transparent' }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.titulo}</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', paddingTop: 5, paddingBottom: 5 }}>Autor: {item.autor.name}</Text>
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

      {/* Controles de Paginação */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => handlePagination('prev')}
          disabled={currentPage === 1}
          style={{
            padding: 10,
            backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
            borderRadius: 5
          }}
        >
          <Text style={{ color: '#fff' }}>Anterior</Text>
        </TouchableOpacity>

        <Text>Página {currentPage} de {totalPages}</Text>

        <TouchableOpacity
          onPress={() => handlePagination('next')}
          disabled={currentPage === totalPages}
          style={{
            padding: 10,
            backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
            borderRadius: 5
          }}
        >
          <Text style={{ color: '#fff' }}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfessorScreen;
