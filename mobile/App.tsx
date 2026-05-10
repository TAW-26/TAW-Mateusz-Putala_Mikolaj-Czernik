import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from './src/store/authStore'; // Importujemy stan autoryzacji
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen'; // Załóżmy, że tak nazwiesz nowy ekran

const Stack = createNativeStackNavigator();

export default function App() {
    // Pobieramy token ze store'a, aby wiedzieć, czy użytkownik jest zalogowany
    const token = useAuthStore((state) => state.token);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {token ? (
                    // Jeśli mamy token, pokazujemy ekrany dla zalogowanych
                    <Stack.Screen name="Home" component={HomeScreen} />
                ) : (
                    // Jeśli nie ma tokena, pokazujemy logowanie
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}