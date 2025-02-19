import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import CreateUserScreen from "./src/screens/CreateUserScreen";
import ProfessorScreen from "./src/screens/ProfessorScreen";
import AdminScreen from "./src/screens/CreateUserScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ReadingScreen from "./src/screens/ReadingScreen";
import CreatePostScreen from "./src/screens/CreatePostScreen";
import EditScreen from "./src/screens/EditScreen";
import UserScreen from "./src/screens/UserScreen";
import EditUserScreen from "./src/screens/EditUserScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">

      <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ReadingScreen" component={ReadingScreen} />
        <Stack.Screen name="CreateUserScreen" component={CreateUserScreen} />
        <Stack.Screen name="ProfessorScreen" component={ProfessorScreen} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} /> 
        <Stack.Screen name="EditScreen" component={EditScreen} /> 
        <Stack.Screen name="EditUserScreen" component={EditUserScreen} /> 
        <Stack.Screen name="UserScreen" component={UserScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}