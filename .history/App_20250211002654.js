import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/componentes/HomeScreen";
import LoginScreen from "./src/componentes/LoginScreen/LoginScreen";
import ProfessorScreen from "./src/componentes/ProfessorScreen/ProfessorScreen";
import GerenciarProfessores from "./src/componentes/GerenciarProfessores/GerenciarProfessores"; // Verifique o caminho!
import CadastrarProfessor from "./src/componentes/CadastrarProfessor/CadastrarProfessor";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} /> 
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="ProfessorScreen" component={ProfessorScreen} />
        <Stack.Screen name="GerenciarProfessores" component={GerenciarProfessores} options={{ title: "Gerenciar Professores" }} />
        <Stack.Screen name="CadastrarProfessor" component={CadastrarProfessor} options={{ title: "Cadastrar Professor" }} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
