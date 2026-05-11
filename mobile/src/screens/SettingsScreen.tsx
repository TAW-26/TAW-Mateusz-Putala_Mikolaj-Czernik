import React, { useState } from 'react';
import {
    StyleSheet, Text, View, ScrollView, TouchableOpacity,
    SafeAreaView, Switch, Platform
} from 'react-native';
import {
    ChevronLeft, Bell, Moon, Fingerprint,
    Globe, Database, Zap
} from 'lucide-react-native';

export default function SettingsScreen({ navigation }: any) {
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: false,
        biometrics: true,
        saveData: false
    });

    const toggleSwitch = (key: string) => {
        setSettings(prev => ({ ...prev, [key]: !(prev as any)[key] }));
    };

    const SettingItem = ({ icon: Icon, label, sub, value, onToggle, color }: any) => (
        <View style={styles.item}>
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                <Icon size={20} color={color} />
            </View>
            <View style={styles.info}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.sub}>{sub}</Text>
            </View>
            <Switch
                trackColor={{ false: "#e4e4e7", true: "#6366f1" }}
                thumbColor={Platform.OS === 'ios' ? '#fff' : (value ? '#fff' : '#f4f4f5')}
                onValueChange={onToggle}
                value={value}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft color="#18181b" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>System Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Connectivity & Security</Text>
                <View style={styles.group}>
                    <SettingItem
                        icon={Bell} color="#f59e0b"
                        label="Mission Alerts" sub="Real-time waypoint updates"
                        value={settings.notifications}
                        onToggle={() => toggleSwitch('notifications')}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon={Fingerprint} color="#10b981"
                        label="Biometric Link" sub="Secure access with FaceID/TouchID"
                        value={settings.biometrics}
                        onToggle={() => toggleSwitch('biometrics')}
                    />
                </View>

                <Text style={styles.sectionTitle}>Interface Config</Text>
                <View style={styles.group}>
                    <SettingItem
                        icon={Moon} color="#6366f1"
                        label="Dark Mode" sub="Stealth visual interface"
                        value={settings.darkMode}
                        onToggle={() => toggleSwitch('darkMode')}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon={Globe} color="#3b82f6"
                        label="Offline Maps" sub="Download tactical data"
                        value={settings.saveData}
                        onToggle={() => toggleSwitch('saveData')}
                    />
                </View>

                <View style={styles.infoBox}>
                    <Zap size={14} color="#71717a" />
                    <Text style={styles.infoText}>Voyager Mobile v1.0.4 | Engine: Llama 3.3</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fcfcfc' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingBottom: 12,
        paddingTop: Platform.OS === 'android' ? 45 : 12
    },
    backBtn: { padding: 8, backgroundColor: '#f4f4f5', borderRadius: 12 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#18181b' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 11, fontWeight: '900', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginLeft: 8 },
    group: { backgroundColor: '#fff', borderRadius: 24, padding: 8, marginBottom: 24, borderWidth: 1, borderColor: '#f4f4f5' },
    item: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    iconBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    info: { flex: 1, marginLeft: 16 },
    label: { fontSize: 15, fontWeight: 'bold', color: '#18181b' },
    sub: { fontSize: 12, color: '#71717a', marginTop: 2 },
    divider: { height: 1, backgroundColor: '#f4f4f5', marginLeft: 58 },
    infoBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 },
    infoText: { fontSize: 10, fontWeight: 'bold', color: '#a1a1aa' }
});