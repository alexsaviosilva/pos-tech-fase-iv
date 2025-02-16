import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditScreen = ({ route, navigation }) => {
  const { post } = route.params; // Recebe o post passado pela tela anterior
  const [titulo, setTitulo] = useState(post.titulo);
  const [descricao, setDescricao] = useState(post.descricao);
  const [loading, setLoading] = useState(false);
  const API_URL = 'http://192.168.0.25:3000';

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${API_URL}/posts/publicacoes/${post._id}`,
        { titulo, descricao },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Sucesso', 'Post atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao atualizar post:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível atualizar o post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Título:</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 10,
              marginBottom: 20
            }}
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Descrição:</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 10,
              marginBottom: 20,
              height: 100,
              textAlignVertical: 'top'
            }}
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          <TouchableOpacity
            onPress={handleSave}
            style={{
              padding: 10,
              backgroundColor: '#007bff',
              borderRadius: 5,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff' }}>Salvar Alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              padding: 10,
              backgroundColor: '#ccc',
              borderRadius: 5,
              alignItems: 'center',
              marginTop: 10
            }}
          >
            <Text style={{ color: '#000' }}>Cancelar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default EditScreen;
