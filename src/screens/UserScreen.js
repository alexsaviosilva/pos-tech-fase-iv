import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const API_URL = 'http://192.168.0.25:3000'; // Ajuste com seu backend
const usersPerPage = 4; // Número de usuários por página

const UserScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Página inicial
  const [roleFilter, setRoleFilter] = useState('all'); // Filtro de 'all', 'professor', 'aluno'

  // Função para buscar usuários do backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/autores`);
        console.log("Posts recebidos:", response.data);  // Verificando o que está sendo recebido
        setUsers(response.data); // Armazenar todos os usuários
        setFilteredUsers(response.data); // Inicializa com todos os usuários
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtro de usuários por role (professor ou aluno)
  useEffect(() => {
    console.log('Role filter:', roleFilter); // Verificando o filtro aplicado
    if (roleFilter === 'all') {
      setFilteredUsers(users); // Exibe todos os usuários
    } else {
      const filtered = users.filter(user => user.role === roleFilter);
      setFilteredUsers(filtered); // Filtra os usuários de acordo com o papel selecionado
    }
    
    // Resetar a página para 1 sempre que o filtro mudar
    setCurrentPage(1);
  }, [roleFilter, users]);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${API_URL}/autores/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
      Alert.alert('Sucesso', 'Usuário excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      Alert.alert('Erro', 'Não foi possível excluir o usuário.');
    }
  };

  const handleEdit = (user) => {
    navigation.navigate('EditUserScreen', { user });
  };

  // Função de paginação
  const handlePagination = (direction) => {
    // Atualizar página com base na direção (-1 para anterior, 1 para próximo)
    if (direction === -1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 1 && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calcular o número total de páginas
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  console.log("Total Pages:", totalPages);  // Verificando o número de páginas

  // Calcular os usuários a serem exibidos na página atual
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage, 
    currentPage * usersPerPage
  );
  console.log("Users for current page:", currentUsers);  // Verificando os usuários na página atual

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Usuários</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateUserScreen')}>
          <Icon name="plus-circle" size={30} color="#007bff" />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => setRoleFilter('professor')} style={{ marginRight: 20 }}>
          <Text style={{ fontSize: 16 }}>Professores</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRoleFilter('aluno')} style={{ marginRight: 20 }}>
          <Text style={{ fontSize: 16 }}>Alunos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRoleFilter('all')}>
          <Text style={{ fontSize: 16 }}>Todos</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={currentUsers} // Exibir apenas os usuários da página atual
          renderItem={({ item }) => (
            <View style={{ marginBottom: 15, padding: 10, borderBottomWidth: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ fontSize: 14 }}>Email: {item.email}</Text>
              <Text style={{ fontSize: 14 }}>Role: {item.role}</Text>
              {item.role === 'professor' && <Text style={{ fontSize: 14 }}>Disciplina: {item.disciplina}</Text>}
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={{ marginRight: 10 }}>
                  <Text style={{ color: '#007bff' }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                  <Text style={{ color: '#ff0000' }}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => handlePagination(-1)}
            disabled={currentPage === 1}
            style={{
              padding: 10,
              backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
              borderRadius: 5,
            }}
          >
            <Text style={{ color: '#fff' }}>Anterior</Text>
          </TouchableOpacity>

          <Text>
            Página {currentPage} de {totalPages}
          </Text>

          <TouchableOpacity
            onPress={() => handlePagination(1)}
            disabled={currentPage === totalPages}
            style={{
              padding: 10,
              backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
              borderRadius: 5,
            }}
          >
            <Text style={{ color: '#fff' }}>Próximo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default UserScreen;
