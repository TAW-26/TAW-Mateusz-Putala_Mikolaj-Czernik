import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { useAuthStore } from './src/store/authStore';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddTripScreen from './src/screens/AddTripScreen';
import TripDetailsScreen from './src/screens/TripDetailsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditTripScreen from './src/screens/EditTripScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import UserPreferencesScreen from './src/screens/UserPreferencesScreen';

const Stack = createNativeStackNavigator();

function AppNavigation() {
    const token = useAuthStore((state) => state.token);
    const { ready, colors, common } = useTheme();

    const navTheme = {
        ...(colors.statusBar === 'light' ? DarkTheme : DefaultTheme),
        colors: {
            ...(colors.statusBar === 'light' ? DarkTheme.colors : DefaultTheme.colors),
            background: colors.page,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
            primary: colors.accent,
        },
    };

    if (!ready) {
        return (
            <View style={common.centered}>
                <ActivityIndicator size="large" color={colors.textMuted} />
            </View>
        );
    }

    return (
        <NavigationContainer theme={navTheme}>
            <StatusBar style={colors.statusBar} />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.page },
                }}
            >
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

export default function App() {
    return (
        <ThemeProvider>
            <AppNavigation />
        </ThemeProvider>
    );
}
