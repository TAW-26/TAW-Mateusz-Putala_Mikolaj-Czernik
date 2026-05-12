import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from './src/store/authStore';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen'; // DODANY IMPORT
import HomeScreen from './src/screens/HomeScreen';
import AddTripScreen from './src/screens/AddTripScreen';
import TripDetailsScreen from './src/screens/TripDetailsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditTripScreen from "./src/screens/EditTripScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import UserPreferencesScreen from "./src/screens/UserPreferencesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    const token = useAuthStore((state) => state.token);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {token ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="AddTrip" component={AddTripScreen} />
                        <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="EditTrip" component={EditTripScreen} />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                        <Stack.Screen name="UserPreferences" component={UserPreferencesScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}