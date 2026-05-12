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
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native'; // Używamy Lucide dla spójności
import api from '../api/axiosInstance';

export default function RegisterScreen({ navigation }: any) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        const { username, email, password, confirmPassword } = formData;

        // Walidacja frontendowa
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Info', 'Wypełnij wszystkie pola operacyjne.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Błąd', 'Hasła nie są identyczne.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Błąd', 'Hasło musi mieć minimum 6 znaków.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', {
                username,
                email,
                password
            });

            Alert.alert(
                "Konto utworzone!",
                "Twój profil Voyager AI jest gotowy. Możesz się teraz zalogować.",
                [{ text: "OK", onPress: () => navigation.navigate('Login') }]
            );
        } catch (error: any) {
            console.log("Registration error:", error);
            const message = error.response?.data?.message || "Nie udało się utworzyć konta.";
            Alert.alert('Błąd Rejestracji', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollInner}>
                {/* Przycisk powrotu */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ChevronLeft color="#18181b" size={24} />
                </TouchableOpacity>

                <View style={styles.headerContainer}>
                    <Text style={styles.webTitle}>Join Voyager</Text>
                    <Text style={styles.subtitle}>Create your AI-powered travel profile</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="voyager_explorer"
                            placeholderTextColor="#a1a1aa"
                            value={formData.username}
                            onChangeText={(txt) => setFormData({...formData, username: txt})}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="explorer@voyager.pl"
                            placeholderTextColor="#a1a1aa"
                            value={formData.email}
                            onChangeText={(txt) => setFormData({...formData, email: txt})}
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
                            value={formData.password}
                            onChangeText={(txt) => setFormData({...formData, password: txt})}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#a1a1aa"
                            value={formData.confirmPassword}
                            onChangeText={(txt) => setFormData({...formData, confirmPassword: txt})}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && { opacity: 0.5 }]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.loginLink}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginText}>
                        Already have an account? <Text style={styles.boldText}>Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollInner: { padding: 24, paddingBottom: 40 },
    backButton: {
        marginTop: Platform.OS === 'android' ? 40 : 10,
        padding: 8,
        backgroundColor: '#f4f4f5',
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 20
    },
    headerContainer: { marginBottom: 32 },
    webTitle: { fontSize: 30, fontWeight: 'bold', color: '#18181b', marginBottom: 8 },
    subtitle: { color: '#71717a', fontSize: 14 },
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
        marginTop: 10,
        elevation: 4,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1, fontSize: 13 },
    loginLink: { marginTop: 32, alignSelf: 'center' },
    loginText: { color: '#71717a', fontSize: 14 },
    boldText: { color: '#18181b', fontWeight: 'bold' }
});