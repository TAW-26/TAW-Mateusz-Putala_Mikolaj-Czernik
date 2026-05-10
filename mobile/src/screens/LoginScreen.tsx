import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import api from '../api/axiosInstance';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Info', 'Check your credentials (admin@voyager.pl / Haslo123!)');
            return;
        }

        setLoading(true);
        try {
            // Logowanie do backendu na Renderze
            const response = await api.post('/auth/login', { email, password });

            const { user, token } = response.data;

            // Ustawienie autoryzacji w store - to automatycznie przełączy ekran w App.tsx
            setAuth(user, token);

            // Log w konsoli zamiast Alertu sukcesu sprawia, że przejście jest płynniejsze
            console.log("Login success for:", user.email);

        } catch (error: any) {
            console.log("Login error:", error);
            let message = 'Nie udało się zalogować. Sprawdź dane.';

            if (error.code === 'ERR_NETWORK') {
                message = 'Błąd sieci: Serwer nie odpowiada. Sprawdź połączenie z internetem.';
            } else if (error.response?.status === 401) {
                message = 'Błędny e-mail lub hasło.';
            }

            Alert.alert('Login Failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.inner}>
                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoIcon}>🧭</Text>
                </View>

                <Text style={styles.webTitle}>Welcome Back</Text>
                <Text style={styles.subtitle}>Log in to your Voyager AI account</Text>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="admin@voyager.pl"
                            placeholderTextColor="#a1a1aa"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#a1a1aa"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && { opacity: 0.5 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>SIGN IN</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.registerLink}>
                    <Text style={styles.registerText}>
                        Don't have an account? <Text style={styles.boldText}>Register here</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    inner: { flex: 1, justifyContent: 'center', padding: 24, alignItems: 'center' },
    logoContainer: {
        padding: 20,
        backgroundColor: '#18181b',
        borderRadius: 30,
        marginBottom: 16,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    logoIcon: { fontSize: 32 },
    webTitle: { fontSize: 30, fontWeight: 'bold', color: '#18181b', marginBottom: 8 },
    subtitle: { color: '#71717a', fontSize: 14, marginBottom: 40 },
    form: { width: '100%' },
    inputGroup: { marginBottom: 16 },
    label: {
        fontSize: 10,
        fontWeight: '900',
        color: '#a1a1aa',
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    input: {
        backgroundColor: '#f4f4f5',
        borderWidth: 2,
        borderColor: '#e4e4e7',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#18181b'
    },
    button: {
        backgroundColor: '#18181b',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 20,
        elevation: 4,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1, fontSize: 13 },
    registerLink: { marginTop: 32 },
    registerText: { color: '#71717a', fontSize: 14 },
    boldText: { color: '#18181b', fontWeight: 'bold' }
});