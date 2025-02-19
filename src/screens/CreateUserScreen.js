import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, Picker } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.0.25:3000'; // Ajuste com seu backend

const CreateUserScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('professor');
  const [disciplina, setDisciplina] = useState(''); // Campo de disciplina
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    setLoading(true);

    // Se o role for professor, e a disciplina não estiver preenchida, mostre um alerta
    if (role === 'professor' && !disciplina) {
      Alert.alert('Erro', 'Por favor, selecione uma disciplina para o professor.');
      setLoading(false);
      return;
    }

    console.log('Dados para enviar:', {
      name,
      email,
      password,
      role,
      disciplina: role === 'professor' ? disciplina : undefined, // Envia disciplina apenas se for professor
    });

    try {
      // Enviar disciplina apenas quando o role for professor
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        role,
        disciplina: role === 'professor' ? disciplina : undefined, // Não enviar disciplina se for aluno
      });
      console.log('Resposta do servidor:', response.data); // Log da resposta

      Alert.alert('Sucesso', response.data.message);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Criar Usuário</Text>

      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={{ borderWidth: 1, marginBottom: 20 }}
      >
        <Picker.Item label="Professor" value="professor" />
        <Picker.Item label="Aluno" value="aluno" />
      </Picker>

      {role === 'professor' && (
        <Picker
          selectedValue={disciplina}
          onValueChange={(itemValue) => setDisciplina(itemValue)}
          style={{ borderWidth: 1, marginBottom: 20 }}
        >
          <Picker.Item label="Português" value="Português" />
          <Picker.Item label="Matemática" value="Matemática" />
          <Picker.Item label="Artes" value="Artes" />
          <Picker.Item label="Geografia" value="Geografia" />
          <Picker.Item label="Ciências" value="Ciências" />
        </Picker>
      )}

      <TouchableOpacity
        onPress={handleCreateUser}
        style={{
          backgroundColor: '#007bff',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
        }}
        disabled={loading}
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>
          {loading ? 'Criando...' : 'Criar Usuário'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateUserScreen;
