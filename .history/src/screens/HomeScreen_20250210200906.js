  import React, { useState, useEffect } from 'react';
  import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
  import Icon from 'react-native-vector-icons/FontAwesome';

  import axios from 'axios';

  const HomeScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]); // Para armazenar os posts filtrados
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState(''); // Para armazenar o texto da busca
    const API_URL = 'http://172.19.96.1';
    const postsPerPage = 4;

    useEffect(() => {
      const fetchPosts = async () => {
        setLoading(true);
        try {
          // Adiciona o console.log para verificar se a requisição foi feita corretamente
          console.log('Buscando posts...');
          const response = await axios.get(API_URL + '/posts/publicacoes');
          console.log('Posts recebidos:', response.data); // Verifique a resposta da API
          setPosts(response.data);
          setFilteredPosts(response.data); // Inicialmente, mostra todos os posts
        } catch (error) {
          console.error('Erro ao buscar publicações:', error.response?.data || error.message);
        } finally {
          setLoading(false); // Garanta que o estado de loading seja alterado após a requisição
        }
      };

      fetchPosts();
    }, []);

    // Filtra os posts conforme o texto de busca
    const handleSearch = (text) => {
      setSearchText(text);

      if (text === '') {
        setFilteredPosts(posts); // Se a busca estiver vazia, mostra todos os posts
      } else {
        const filtered = posts.filter(post =>
          post.titulo.toLowerCase().includes(text.toLowerCase()) ||
          post.descricao.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredPosts(filtered); // Atualiza os posts filtrados
      }
    };

    // Divisão dos posts conforme a página atual
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    return (
      <View style={{ flex: 1, padding: 20 }}>
        {/* Adicionando o ícone de login no canto superior direito */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Bem-vindo ao blog 👋</Text>
          
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Icon name="user" size={30} color="#007bff" />
          </TouchableOpacity>
        </View>

        {/* Campo de busca */}
        <TextInput
          style={{
            height: 40,
            borderColor: '#ccc',
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
                  onPress={() => navigation.navigate('ReadingScreen', { postId: item._id })}
                  style={{ marginBottom: 15, padding: 10, borderBottomWidth: 1 }}
                >
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.titulo}</Text>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', paddingTop:5, paddingBottom:5 }}>Autor: {item.autor.name}</Text>
                  <Text>{item.descricao.slice(0, 150)}...</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
            />

            {/* Controles de Paginação */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => setCurrentPage(currentPage - 1)}
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
                onPress={() => setCurrentPage(currentPage + 1)}
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
          </>
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma publicação encontrada.</Text>
        )}
      </View>
    );
  };

  export default HomeScreen;