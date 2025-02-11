import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../../config";
import styles from "./styles";

const ProfessorScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);  // Verifica se o usuário está logado
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      setIsLoggedIn(false);
      navigation.navigate("HomeScreen");  // Redireciona para a HomeScreen após logout
      Alert.alert("Sucesso", "Você foi desconectado!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error.message);
      Alert.alert("Erro", "Não foi possível realizar o logout.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Painel da Professora 👩‍🏫</Text>

        {isLoggedIn && (
          <View style={styles.headerButtons}>
            {/* Botão Gerenciar Professores */}
            <TouchableOpacity onPress={() => navigation.navigate("GerenciarProfessores")} style={styles.iconButton}>
              <Icon name="users" size={30} color="#007bff" />
            </TouchableOpacity>

            {/* Botão Criar Publicação */}
            <TouchableOpacity onPress={() => navigation.navigate("CreatePostScreen")} style={styles.iconButton}>
              <Icon name="plus-circle" size={30} color="#007bff" />
            </TouchableOpacity>

            {/* Botão Logout */}
            <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
              <Icon name="sign-out" size={30} color="#007bff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.noPostsText}>Bem-vinda, Professora! Agora você pode gerenciar os professores e criar novas publicações.</Text>
    </View>
  );
};

export default ProfessorScreen;
