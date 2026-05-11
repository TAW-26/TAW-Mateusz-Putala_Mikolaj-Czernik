import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, ScrollView, TextInput,
    TouchableOpacity, ActivityIndicator, SafeAreaView, Alert, Platform
} from 'react-native';
import { User, Lock, ShieldCheck, Save, ChevronLeft, Settings, ChevronRight, Sparkles } from 'lucide-react-native';
import { userService } from '../api/userService';
import { useAuthStore } from '../store/authStore';

export default function ProfileScreen({ navigation }: any) {
    const { user, setAuth } = useAuthStore();
    const [info, setInfo] = useState({ username: user?.username || '', email: user?.email || '' });
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleUpdateInfo = async () => {
        if (!info.username || !info.email) return Alert.alert("Error", "Fill all fields.");
        setLoading(true);
        try {
            await userService.updateProfile(info);
            setAuth({ ...user, ...info }, useAuthStore.getState().token || '');
            Alert.alert("Success", "Profile updated successfully.");
        } catch (err: any) {
            Alert.alert("Error", err.response?.data?.message || "Update failed.");
        } finally { setLoading(false); }
    };

    const handleChangePass = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            return Alert.alert("Error", "New passwords do not match.");
        }
        setLoading(true);
        try {
            await userService.changePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            Alert.alert("Success", "Password changed.");
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            Alert.alert("Error", err.response?.data?.message || "Change failed.");
        } finally { setLoading(false); }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft color="#18181b" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={styles.headerIcon}>
                    <ShieldCheck size={24} color="#6366f1" />
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Podstawowe info */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <User size={20} color="#6366f1" />
                        <Text style={styles.cardTitle}>Basic Info</Text>
                    </View>

                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={info.username}
                        onChangeText={(t) => setInfo({...info, username: t})}
                    />

                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        value={info.email}
                        keyboardType="email-address"
                        onChangeText={(t) => setInfo({...info, email: t})}
                    />

                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={handleUpdateInfo}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <><Save size={18} color="#fff" /><Text style={styles.saveBtnText}>Save Changes</Text></>}
                    </TouchableOpacity>
                </View>

                {/* PRZYCISK 1: AI Neural Protocol */}
                <TouchableOpacity
                    style={styles.settingsLinkCard}
                    onPress={() => navigation.navigate('UserPreferences')}
                >
                    <View style={styles.settingsLinkLeft}>
                        <View style={[styles.settingsIconBox, { backgroundColor: '#eef2ff' }]}>
                            <Sparkles size={20} color="#6366f1" />
                        </View>
                        <View>
                            <Text style={styles.settingsLinkTitle}>AI Neural Protocol</Text>
                            <Text style={styles.settingsLinkSub}>Interests, Travel Style & Traits</Text>
                        </View>
                    </View>
                    <ChevronRight size={18} color="#a1a1aa" />
                </TouchableOpacity>

                {/* PRZYCISK 2: App Settings (Zmieniona nazwa) */}
                <TouchableOpacity
                    style={styles.settingsLinkCard}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <View style={styles.settingsLinkLeft}>
                        <View style={styles.settingsIconBox}>
                            <Settings size={20} color="#18181b" />
                        </View>
                        <View>
                            <Text style={styles.settingsLinkTitle}>App Settings</Text>
                            <Text style={styles.settingsLinkSub}>Language, Theme & System</Text>
                        </View>
                    </View>
                    <ChevronRight size={18} color="#a1a1aa" />
                </TouchableOpacity>

                {/* Bezpieczeństwo */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Lock size={20} color="#f43f5e" />
                        <Text style={styles.cardTitle}>Security</Text>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Current Password"
                        secureTextEntry
                        value={passwords.oldPassword}
                        onChangeText={(t) => setPasswords({...passwords, oldPassword: t})}
                    />
                    <View style={styles.divider} />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        secureTextEntry
                        value={passwords.newPassword}
                        onChangeText={(t) => setPasswords({...passwords, newPassword: t})}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        secureTextEntry
                        value={passwords.confirmPassword}
                        onChangeText={(t) => setPasswords({...passwords, confirmPassword: t})}
                    />

                    <TouchableOpacity style={styles.passBtn} onPress={handleChangePass}>
                        <Text style={styles.passBtnText}>Update Password</Text>
                    </TouchableOpacity>
                </View>

                {/* Dystans dla klawiatury */}
                <View style={{ height: 250 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fcfcfc' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: Platform.OS === 'android' ? 45 : 10
    },
    backBtn: { padding: 8, backgroundColor: '#f4f4f5', borderRadius: 12 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#18181b' },
    headerIcon: { padding: 8, backgroundColor: '#eef2ff', borderRadius: 12 },
    scrollContent: { padding: 20 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 24, marginBottom: 20, borderWidth: 1, borderColor: '#f4f4f5' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#18181b' },
    label: { fontSize: 11, fontWeight: '900', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
    input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 14, padding: 12, marginBottom: 16, fontSize: 15, color: '#18181b' },
    saveBtn: { backgroundColor: '#4f46e5', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 14, gap: 8 },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    settingsLinkCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f4f4f5'
    },
    settingsLinkLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    settingsIconBox: { backgroundColor: '#f4f4f5', padding: 10, borderRadius: 12 },
    settingsLinkTitle: { fontSize: 15, fontWeight: 'bold', color: '#18181b' },
    settingsLinkSub: { fontSize: 12, color: '#a1a1aa' },
    passBtn: { backgroundColor: '#18181b', padding: 16, borderRadius: 14, alignItems: 'center' },
    passBtnText: { color: '#fff', fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#f3f4f6', marginBottom: 16 }
});