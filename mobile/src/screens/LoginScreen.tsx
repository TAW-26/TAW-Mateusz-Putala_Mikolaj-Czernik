import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.inner}>
                <Text style={styles.logoText}>VOYAGER AI</Text>
                <Text style={styles.subtitle}>Witaj ponownie, podróżniku!</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Hasło"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={() => alert('Logowanie...')}>
                    <Text style={styles.buttonText}>Zaloguj się</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkButton}>
                    <Text style={styles.linkText}>Nie masz konta? Zarejestruj się</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa' },
    inner: { flex: 1, justifyContent: 'center', padding: 30, alignItems: 'center' },
    logoText: { fontSize: 32, fontWeight: 'bold', color: '#2ecc71', letterSpacing: 2 },
    subtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 40 },
    inputContainer: { width: '100%', marginBottom: 20 },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#dcdde1',
        fontSize: 16
    },
    button: {
        backgroundColor: '#2ecc71',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 3, // Cień na Androidzie
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    linkButton: { marginTop: 20 },
    linkText: { color: '#3498db' }
});