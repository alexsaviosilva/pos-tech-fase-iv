import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.0.25:3000'; // Ajuste com seu backend

const EditUserScreen = ({ route, navigation }) => {
  const { user } = route.params; // Pegando os dados do usuário passado pela tela anterior
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [disciplina, setDisciplina] = useState(user.disciplina);

  const handleSave = async () => {
    if (!name || !email || !role) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/autores/${user._id}`, {
        name,
        email,
        role,
        disciplina
      });

      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      navigation.goBack(); // Volta para a tela anterior
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o usuário.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuário</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Role"
        value={role}
        onChangeText={setRole}
      />
      {role === 'professor' && (
        <TextInput
          style={styles.input}
          placeholder="Disciplina"
          value={disciplina}
          onChangeText={setDisciplina}
        />
      )}

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditUserScreen;
