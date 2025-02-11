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

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">

      <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ReadingScreen" component={ReadingScreen} />
        <Stack.Screen name="AlunoScreen" component={AlunoScreen} />
        <Stack.Screen name="ProfessorScreen" component={ProfessorScreen} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}