import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import AlunoScreen from "./src/screens/AlunoScreen";
import ProfessorScreen from "./src/screens/ProfessorScreen";
import AdminScreen from "./src/screens/AdminScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ReadingScreen from "./src/screens/ReadingScreen";
import CreatePostScreen from "./src/screens/CreatePostScreen";

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