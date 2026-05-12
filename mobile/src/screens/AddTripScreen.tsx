import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TextInput, ScrollView,
    TouchableOpacity, SafeAreaView, ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform
} from 'react-native';
import {
    ChevronLeft, Send, Sparkles, Minus, Plus,
    Calendar as CalendarIcon, MapPin, Flag, MessageSquare, Activity, Route, Clock, Banknote
} from 'lucide-react-native';
import api from '../api/axiosInstance';
// IMPORT BIBLIOTEKI KALENDARZA
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function AddTripScreen({ navigation }: any) {
    const [loading, setLoading] = useState(false);

    // Sterowanie widocznością kalendarzy
    const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
    const [isEndPickerVisible, setEndPickerVisibility] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        origin: { address: '' },
        destination: { address: '' },
        startDate: '',
        endDate: '',
        budget: '',
        description: '',
        aiSettings: {
            intensity: 5,
            discoverySpread: 5,
            numberOfPoints: 10,
        }
    });

    // Funkcje obsługi daty
    const handleConfirmStart = (date: Date) => {
        const formatted = date.toISOString().split('T')[0];
        setFormData({ ...formData, startDate: formatted });
        setStartPickerVisibility(false);
    };

    const handleConfirmEnd = (date: Date) => {
        const formatted = date.toISOString().split('T')[0];
        setFormData({ ...formData, endDate: formatted });
        setEndPickerVisibility(false);
    };

    const updateAiSetting = (key: string, delta: number, min: number, max: number) => {
        setFormData(prev => ({
            ...prev,
            aiSettings: {
                ...prev.aiSettings,
                [key]: Math.min(max, Math.max(min, (prev.aiSettings as any)[key] + delta))
            }
        }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.origin.address || !formData.destination.address) {
            Alert.alert("Requirement check failed", "Please specify mission title, origin and destination.");
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData, budget: Number(formData.budget) || 0 };
            await api.post('/trips', payload);
            Alert.alert("Success", "Mission Initialized");
            navigation.navigate('Home');
        } catch (err: any) {
            Alert.alert("Error", err.response?.data?.message || "Failed to deploy mission.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <ChevronLeft color="#18181b" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Voyager Mission Deployment</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View style={styles.section}>
                        <Text style={styles.label}>Trip Title</Text>
                        <TextInput style={styles.input} placeholder="np. Roadtrip przez Polskę" placeholderTextColor="#a1a1aa" value={formData.title} onChangeText={(txt) => setFormData({...formData, title: txt})} />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.section, { flex: 1, marginRight: 12 }]}>
                            <Text style={styles.label}>Starting Point</Text>
                            <View style={styles.inputWithIcon}>
                                <MapPin size={18} color="#a1a1aa" style={{marginRight: 10}} />
                                <TextInput style={styles.flexInput} placeholder="Start City" placeholderTextColor="#a1a1aa" value={formData.origin.address} onChangeText={(txt) => setFormData({...formData, origin: { address: txt }})} />
                            </View>
                        </View>
                        <View style={[styles.section, { flex: 1 }]}>
                            <Text style={styles.label}>Destination</Text>
                            <View style={styles.inputWithIcon}>
                                <Flag size={18} color="#a1a1aa" style={{marginRight: 10}} />
                                <TextInput style={styles.flexInput} placeholder="End City" placeholderTextColor="#a1a1aa" value={formData.destination.address} onChangeText={(txt) => setFormData({...formData, destination: { address: txt }})} />
                            </View>
                        </View>
                    </View>

                    {/* SEKCJA DAT Z MODALEM */}
                    <View style={styles.row}>
                        <View style={[styles.section, { flex: 1, marginRight: 12 }]}>
                            <Text style={styles.label}>Launch Date</Text>
                            <TouchableOpacity style={styles.inputWithIcon} onPress={() => setStartPickerVisibility(true)}>
                                <CalendarIcon size={18} color="#a1a1aa" style={{marginRight: 10}} />
                                <Text style={[styles.flexInput, !formData.startDate && {color: '#a1a1aa'}]}>
                                    {formData.startDate || "Wybierz date"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.section, { flex: 1 }]}>
                            <Text style={styles.label}>Return Date</Text>
                            <TouchableOpacity style={styles.inputWithIcon} onPress={() => setEndPickerVisibility(true)}>
                                <CalendarIcon size={18} color="#a1a1aa" style={{marginRight: 10}} />
                                <Text style={[styles.flexInput, !formData.endDate && {color: '#a1a1aa'}]}>
                                    {formData.endDate || "Wybierz date"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* MODALE KALENDARZA */}
                    <DateTimePickerModal
                        isVisible={isStartPickerVisible}
                        mode="date"
                        onConfirm={handleConfirmStart}
                        onCancel={() => setStartPickerVisibility(false)}
                    />
                    <DateTimePickerModal
                        isVisible={isEndPickerVisible}
                        mode="date"
                        onConfirm={handleConfirmEnd}
                        onCancel={() => setEndPickerVisibility(false)}
                    />

                    <View style={styles.section}>
                        <Text style={styles.label}>Special Requirements / AI Instructions</Text>
                        <View style={[styles.inputWithIcon, { alignItems: 'flex-start', paddingTop: 14 }]}>
                            <MessageSquare size={18} color="#a1a1aa" style={{marginRight: 10, marginTop: 2}} />
                            <TextInput style={[styles.flexInput, { minHeight: 100, textAlignVertical: 'top' }]} placeholder="Np. Chcę omijać autostrady..." placeholderTextColor="#a1a1aa" multiline={true} value={formData.description} onChangeText={(txt) => setFormData({...formData, description: txt})} />
                        </View>
                    </View>

                    <View style={styles.aiCard}>
                        <View style={styles.aiHeaderRow}>
                            <Sparkles size={16} color="#fbbf24" />
                            <Text style={styles.aiHeaderText}>Llama 3.3 Core Settings</Text>
                        </View>

                        <View style={styles.settingRow}>
                            <View>
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                    <Activity size={12} color="#71717a" />
                                    <Text style={styles.settingTitle}>Intensywność</Text>
                                </View>
                                <Text style={styles.settingSub}>Poziom: {formData.aiSettings.intensity}/10</Text>
                            </View>
                            <View style={styles.stepper}>
                                <TouchableOpacity onPress={() => updateAiSetting('intensity', -1, 0, 10)} style={styles.stepBtn}><Minus size={16} color="#fff" /></TouchableOpacity>
                                <TouchableOpacity onPress={() => updateAiSetting('intensity', 1, 0, 10)} style={styles.stepBtn}><Plus size={16} color="#fff" /></TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.settingRow}>
                            <View>
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                    <Route size={12} color="#71717a" />
                                    <Text style={styles.settingTitle}>Eksploracja</Text>
                                </View>
                                <Text style={styles.settingSub}>Zasięg: {formData.aiSettings.discoverySpread}/10</Text>
                            </View>
                            <View style={styles.stepper}>
                                <TouchableOpacity onPress={() => updateAiSetting('discoverySpread', -1, 0, 10)} style={styles.stepBtn}><Minus size={16} color="#fff" /></TouchableOpacity>
                                <TouchableOpacity onPress={() => updateAiSetting('discoverySpread', 1, 0, 10)} style={styles.stepBtn}><Plus size={16} color="#fff" /></TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.settingRow}>
                            <View>
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                    <Clock size={12} color="#71717a" />
                                    <Text style={styles.settingTitle}>Liczba Punktów</Text>
                                </View>
                                <Text style={styles.settingSub}>{formData.aiSettings.numberOfPoints} stops (max 20)</Text>
                            </View>
                            <View style={styles.stepper}>
                                <TouchableOpacity onPress={() => updateAiSetting('numberOfPoints', -1, 1, 20)} style={styles.stepBtn}><Minus size={16} color="#fff" /></TouchableOpacity>
                                <TouchableOpacity onPress={() => updateAiSetting('numberOfPoints', 1, 1, 20)} style={styles.stepBtn}><Plus size={16} color="#fff" /></TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.section}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8}}>
                                <Banknote size={12} color="#71717a" />
                                <Text style={[styles.label, {color: '#71717a', marginBottom: 0}]}>Budżet (PLN)</Text>
                            </View>
                            <TextInput keyboardType="numeric" style={styles.aiInput} placeholder="Np. 2000" placeholderTextColor="#52525b" value={formData.budget.toString()} onChangeText={(v) => setFormData({...formData, budget: v})} />
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.submitButton, loading && {opacity: 0.7}]} onPress={handleSubmit} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : (
                            <><Text style={styles.submitText}>INITIALIZE AI TRAJECTORY</Text><Send size={18} color="#fff" /></>
                        )}
                    </TouchableOpacity>
                    <View style={{ height: 350 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12, // Zachowujemy oryginalny paddingVertical
        // ANALOGICZNE OBNIŻENIE DLA IKON:
        paddingTop: Platform.OS === 'android' ? 45 : 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f5',
        backgroundColor: '#fff'
    },
    backBtn: { padding: 8, backgroundColor: '#f4f4f5', borderRadius: 12 },
    headerTitle: { fontSize: 16, fontWeight: '800', color: '#18181b', letterSpacing: -0.5 },
    scrollContent: { padding: 24 },
    section: { marginBottom: 20 },
    label: { fontSize: 10, fontWeight: '900', color: '#a1a1aa', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', marginLeft: 4 },
    input: { backgroundColor: '#f4f4f5', borderRadius: 20, padding: 18, fontSize: 16, color: '#18181b', borderWidth: 2, borderColor: '#f4f4f5', fontWeight: '600' },
    inputWithIcon: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f4f5', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 16, borderWidth: 2, borderColor: '#f4f4f5' },
    flexInput: { flex: 1, fontSize: 15, color: '#18181b', fontWeight: '600' },
    row: { flexDirection: 'row' },
    aiCard: { backgroundColor: '#18181b', borderRadius: 35, padding: 28, marginVertical: 10, marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
    aiHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
    aiHeaderText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    settingTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    settingSub: { color: '#71717a', fontSize: 11, marginTop: 2 },
    stepper: { flexDirection: 'row', gap: 10 },
    stepBtn: { backgroundColor: '#27272a', width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#3f3f46' },
    divider: { height: 1, backgroundColor: '#27272a', marginVertical: 10, marginBottom: 20 },
    aiInput: { backgroundColor: '#27272a', borderRadius: 14, padding: 16, color: '#fff', fontWeight: 'bold', fontSize: 16, borderWidth: 1, borderColor: '#3f3f46' },
    submitButton: { backgroundColor: '#18181b', borderRadius: 24, padding: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10 },
    submitText: { color: '#fff', fontWeight: '900', fontSize: 13, letterSpacing: 2 }
});