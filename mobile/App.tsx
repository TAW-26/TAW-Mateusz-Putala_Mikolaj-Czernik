import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from './src/store/authStore';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddTripScreen from './src/screens/AddTripScreen';
import TripDetailsScreen from './src/screens/TripDetailsScreen'; // 1. Importujemy nowy ekran

const Stack = createNativeStackNavigator();

export default function App() {
    const token = useAuthStore((state) => state.token);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {token ? (
                    // Grupa ekranów dostępnych po zalogowaniu
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="AddTrip" component={AddTripScreen} />
                        <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
                        {/* 2. Dodajemy ekran do stosu */}
                    </>
                ) : (
                    // Grupa ekranów dla niezalogowanych
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}