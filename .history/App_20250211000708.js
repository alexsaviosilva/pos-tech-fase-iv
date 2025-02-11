import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/componentes/LoginScreen/LoginScreen";
import AlunoScreen from "./src/componentes/AlunoScreen";
import ProfessorScreen from "./src/componentes/ProfessorScreen/ProfessorScreen";
import AdminScreen from "./src/componentes/AdminScreen";
import HomeScreen from "./src/componentes/HomeScreen";
import ReadingScreen from "./src/componentes/ReadingScreen";
import CreatePostScreen from "./src/componentes/CreatePostScreen";
import GerenciarProfessores from "./src/componentes/ProfessorScreen/GerenciarProfessores"; // ✅ Nova rota
import CadastrarProfessor from "./src/componentes/ProfessorScreen/CadastrarProfessor"; // ✅ Nova rota
import EditarProfessor from "./src/componentes/ProfessorScreen/EditarProfessor"; // ✅ Nova rota
import EditPostScreen from "./src/componentes/EditPostScreen"; // ✅ Nova rota

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: "Início" }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="ReadingScreen" component={ReadingScreen} options={{ title: "Leitura" }} />
        <Stack.Screen name="AlunoScreen" component={AlunoScreen} options={{ title: "Área do Aluno" }} />
        <Stack.Screen name="ProfessorScreen" component={ProfessorScreen} options={{ title: "Painel do Professor" }} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} options={{ title: "Administração" }} />
        <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} options={{ title: "Criar Post" }} />
        <Stack.Screen name="EditPostScreen" component={EditPostScreen} options={{ title: "Editar Post" }} />
        <Stack.Screen name="GerenciarProfessores" component={GerenciarProfessores} options={{ title: "Gerenciar Professores" }} />
        <Stack.Screen name="CadastrarProfessor" component={CadastrarProfessor} options={{ title: "Cadastrar Professor" }} />
        <Stack.Screen name="EditarProfessor" component={EditarProfessor} options={{ title: "Editar Professor" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
