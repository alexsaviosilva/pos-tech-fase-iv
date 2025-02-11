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
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigation.navigate("HomeScreen");
    Alert.alert("Sucesso", "Você foi desconectado!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Painel da Professora 👩‍🏫</Text>

        {isLoggedIn && (
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => navigation.navigate("GerenciarProfessores")} style={styles.iconButton}>
              <Icon name="users" size={30} color="#007bff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
              <Icon name="sign-out" size={30} color="#007bff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.noPostsText}>Bem-vinda, Professora! Agora você pode gerenciar os professores.</Text>
    </View>
  );
};

export default ProfessorScreen;
