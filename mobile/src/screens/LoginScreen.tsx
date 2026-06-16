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
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useAuthStore } from '../store/authStore';
import api from '../api/axiosInstance';
import { BrandMark } from '../components/ui/BrandMark';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen({ navigation }: any) {
    const { colors, common } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Uwaga', 'Podaj e-mail i hasło.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user, token } = response.data;
            setAuth(user, token);
        } catch (error: any) {
            let message = 'Nie udało się zalogować. Sprawdź dane.';
            if (error.code === 'ERR_NETWORK') {
                message = 'Błąd sieci. Sprawdź połączenie z internetem.';
            } else if (error.response?.status === 401 || error.response?.status === 404) {
                message = 'Błędny e-mail lub hasło.';
            }
            Alert.alert('Logowanie nieudane', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={common.screen}
        >
            <View style={styles.inner}>
                <BrandMark size="md" />
                <Text style={[styles.title, { color: colors.text }]}>Witaj ponownie</Text>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>Zaloguj się do Smart Voyager</Text>

                <View style={styles.form}>
                    <View style={styles.field}>
                        <Text style={common.label}>E-mail</Text>
                        <TextInput
                            style={common.input}
                            placeholder="ty@example.com"
                            placeholderTextColor={colors.textMuted}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={common.label}>Hasło</Text>
                        <TextInput
                            style={common.input}
                            placeholder="••••••••"
                            placeholderTextColor={colors.textMuted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[common.primaryBtn, styles.submit, loading && { opacity: 0.6 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.onAccent} />
                        ) : (
                            <>
                                <Text style={common.primaryBtnText}>Zaloguj się</Text>
                                <ArrowRight size={18} color={colors.onAccent} />
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkWrap}>
                    <Text style={[styles.linkText, { color: colors.textMuted }]}>
                        Nie masz konta? <Text style={[styles.linkBold, { color: colors.text }]}>Zarejestruj się</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    inner: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 32,
    },
    form: { width: '100%' },
    field: { marginBottom: 14 },
    submit: { marginTop: 8 },
    linkWrap: { marginTop: 28 },
    linkText: { fontSize: 14 },
    linkBold: { fontWeight: '600' },
});
