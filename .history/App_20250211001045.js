import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/componentes/HomeScreen";
import ProfessorScreen from "./src/componentes/ProfessorScreen/ProfessorScreen";
import GerenciarProfessores from "./src/componentes/GerenciarProfessores/GerenciarProfessores"; // ✅ Confirme que este caminho está correto!
import CadastrarProfessor from "./src/componentes/ProfessorScreen/CadastrarProfessor";
import EditarProfessor from "./src/componentes/ProfessorScreen/EditarProfessor";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ProfessorScreen" component={ProfessorScreen} />
        <Stack.Screen name="GerenciarProfessores" component={GerenciarProfessores} options={{ title: "Gerenciar Professores" }} />
        <Stack.Screen name="CadastrarProfessor" component={CadastrarProfessor} options={{ title: "Cadastrar Professor" }} />
        <Stack.Screen name="EditarProfessor" component={EditarProfessor} options={{ title: "Editar Professor" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
