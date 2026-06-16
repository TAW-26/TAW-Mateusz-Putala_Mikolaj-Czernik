import React, { useState, useMemo } from 'react';
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
    ScrollView,
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import api from '../api/axiosInstance';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useTheme } from '../context/ThemeContext';

export default function RegisterScreen({ navigation }: any) {
    const { colors, common, headerTop } = useTheme();
    const styles = useMemo(() => StyleSheet.create({
        scroll: {
            padding: 20,
            paddingTop: headerTop,
            paddingBottom: 40,
        },
        field: { marginBottom: 14 },
        linkWrap: { marginTop: 24, alignSelf: 'center' },
        linkText: { fontSize: 14, color: colors.textMuted },
        linkBold: { color: colors.text, fontWeight: '600' },
    }), [colors, headerTop]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        const { username, email, password, confirmPassword } = formData;

        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Uwaga', 'Wypełnij wszystkie pola.');
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
            await api.post('/auth/register', { username, email, password });
            Alert.alert(
                'Konto utworzone',
                'Możesz się teraz zalogować.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
            );
        } catch (error: any) {
            const message = error.response?.data?.message || 'Rejestracja nie powiodła się.';
            Alert.alert('Błąd rejestracji', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={common.screen}
        >
            <ScreenHeader title="Utwórz konto" onBack={() => navigation.goBack()} centerTitle />
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <Text style={common.pageSubtitle}>Dołącz do Smart Voyager</Text>

                <View style={styles.field}>
                    <Text style={common.label}>Nazwa użytkownika</Text>
                    <TextInput
                        style={common.input}
                        placeholder="Twoje imię"
                        placeholderTextColor={colors.textMuted}
                        value={formData.username}
                        onChangeText={(txt) => setFormData({ ...formData, username: txt })}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={common.label}>E-mail</Text>
                    <TextInput
                        style={common.input}
                        placeholder="ty@example.com"
                        placeholderTextColor={colors.textMuted}
                        value={formData.email}
                        onChangeText={(txt) => setFormData({ ...formData, email: txt })}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.field}>
                    <Text style={common.label}>Hasło</Text>
                    <TextInput
                        style={common.input}
                        placeholder="Min. 6 znaków"
                        placeholderTextColor={colors.textMuted}
                        value={formData.password}
                        onChangeText={(txt) => setFormData({ ...formData, password: txt })}
                        secureTextEntry
                    />
                </View>

                <View style={styles.field}>
                    <Text style={common.label}>Potwierdź hasło</Text>
                    <TextInput
                        style={common.input}
                        placeholder="Powtórz hasło"
                        placeholderTextColor={colors.textMuted}
                        value={formData.confirmPassword}
                        onChangeText={(txt) => setFormData({ ...formData, confirmPassword: txt })}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={[common.primaryBtn, loading && { opacity: 0.6 }]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.onAccent} />
                    ) : (
                        <>
                            <Text style={common.primaryBtnText}>Utwórz konto</Text>
                            <ArrowRight size={18} color={colors.onAccent} />
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkWrap}>
                    <Text style={styles.linkText}>
                        Masz już konto? <Text style={styles.linkBold}>Zaloguj się</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
