import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditPostScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [titulo, setTitulo] = useState(post.titulo);
  const [descricao, setDescricao] = useState(post.descricao);
  const [loading, setLoading] = useState(false);
  const API_URL = 'http://192.168.0.25:3000';

  const handleUpdate = async () => {
    if (!titulo || !descricao) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/posts/publicacoes/${post._id}`,
        { titulo, descricao },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Sucesso', 'Post atualizado com sucesso!');
      navigation.goBack(); // Voltar para a tela anterior
    } catch (error) {
      console.error('Erro ao atualizar post:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível atualizar o post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Editar Publicação</Text>

      <Text style={{ fontSize: 16, marginBottom: 5 }}>Título:</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 20,
          paddingLeft: 10,
        }}
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={{ fontSize: 16, marginBottom: 5 }}>Descrição:</Text>
      <TextInput
        style={{
          height: 100,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 20,
          paddingLeft: 10,
          textAlignVertical: 'top',
        }}
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TouchableOpacity
        onPress={handleUpdate}
        style={{
          backgroundColor: '#007bff',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EditPostScreen;
