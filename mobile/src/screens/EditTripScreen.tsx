import React, { useEffect, useState } from 'react';
import {
    StyleSheet, Text, View, TextInput, ScrollView,
    TouchableOpacity, SafeAreaView, ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform
} from 'react-native';
import {
    ChevronLeft, Save, Sparkles, Minus, Plus,
    Calendar as CalendarIcon, MapPin, Flag, MessageSquare, Activity, Route, Clock, Banknote
} from 'lucide-react-native';
import { tripsService } from '../api/tripsService';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function EditTripScreen({ route, navigation }: any) {
    const { id } = route.params;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await tripsService.getTripDetails(id);
                const trip = res.data || res;

                // Formatowanie dat (wycinamy czas, zostawiamy YYYY-MM-DD)
                const start = trip.startDate ? trip.startDate.split('T')[0] : '';
                const end = trip.endDate ? trip.endDate.split('T')[0] : '';

                setFormData({
                    title: trip.title,
                    origin: { address: trip.origin?.address || '' },
                    destination: { address: trip.destination?.address || '' },
                    startDate: start,
                    endDate: end,
                    budget: String(trip.budget || ''),
                    description: trip.description || '',
                    aiSettings: trip.aiSettings || { intensity: 5, discoverySpread: 5, numberOfPoints: 10 }
                });
            } catch (err) {
                Alert.alert("Error", "Failed to fetch trip data.");
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    const handleConfirmStart = (date: Date) => {
        setFormData({ ...formData, startDate: date.toISOString().split('T')[0] });
        setStartPickerVisibility(false);
    };

    const handleConfirmEnd = (date: Date) => {
        setFormData({ ...formData, endDate: date.toISOString().split('T')[0] });
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

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = { ...formData, budget: Number(formData.budget) || 0 };
            await tripsService.updateTrip(id, payload);
            Alert.alert("Success", "Mission Parameters Updated", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (err) {
            Alert.alert("Error", "Update failed.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <View style={styles.centered}><ActivityIndicator color="#18181b" size="large" /></View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <ChevronLeft color="#18181b" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Mission Config</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={styles.label}>Trip Title</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.title}
                            onChangeText={(txt) => setFormData({...formData, title: txt})}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.section, { flex: 1, marginRight: 12 }]}>
                            <Text style={styles.label}>Starting Point</Text>
                            <View style={styles.inputWithIcon}>
                                <MapPin size={18} color="#a1a1aa" style={{marginRight: 10}} />
                                <TextInput
                                    style={styles.flexInput}
                                    value={formData.origin.address}
                                    onChangeText={(txt) => setFormData({...formData, origin: { address: txt }})}
                                />
                            </View>
                        </View>
                        <View style={[styles.section, { flex: 1 }]}>
                            <Text style={styles.label}>Destination</Text>
                            <View style={styles.inputWithIcon}>
                                <Flag size={18} color="#a1a1aa" style={{marginRight: 10}} />
                                <TextInput
                                    style={styles.flexInput}
                                    value={formData.destination.address}
                                    onChangeText={(txt) => setFormData({...formData, destination: { address: txt }})}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.section, { flex: 1, marginRight: 12 }]}>
                            <Text style={styles.label}>Launch Date</Text>
                            <TouchableOpacity style={styles.inputWithIcon} onPress={() => setStartPickerVisibility(true)}>
                                <CalendarIcon size={18} color="#a1a1aa" style={{marginRight: 10}} />
                                <Text style={styles.flexInput}>{formData.startDate || "Select date"}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.section, { flex: 1 }]}>
                            <Text style={styles.label}>Return Date</Text>
                            <TouchableOpacity style={styles.inputWithIcon} onPress={() => setEndPickerVisibility(true)}>
                                <CalendarIcon size={18} color="#a1a1aa" style={{marginRight: 10}} />
                                <Text style={styles.flexInput}>{formData.endDate || "Select date"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

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
                        <Text style={styles.label}>Special Requirements</Text>
                        <View style={[styles.inputWithIcon, { alignItems: 'flex-start', paddingTop: 14 }]}>
                            <MessageSquare size={18} color="#a1a1aa" style={{marginRight: 10, marginTop: 2}} />
                            <TextInput
                                style={[styles.flexInput, { minHeight: 80, textAlignVertical: 'top' }]}
                                multiline={true}
                                value={formData.description}
                                onChangeText={(txt) => setFormData({...formData, description: txt})}
                            />
                        </View>
                    </View>

                    {/* AI CARD - Identyczna jak w AddTripScreen */}
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
                                <Text style={styles.settingSub}>{formData.aiSettings.numberOfPoints} stops</Text>
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
                            <TextInput
                                keyboardType="numeric"
                                style={styles.aiInput}
                                value={formData.budget}
                                onChangeText={(v) => setFormData({...formData, budget: v})}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.submitButton, saving && {opacity: 0.7}]} onPress={handleSave} disabled={saving}>
                        {saving ? <ActivityIndicator color="#fff" /> : (
                            <><Text style={styles.submitText}>SAVE CHANGES</Text><Save size={18} color="#fff" /></>
                        )}
                    </TouchableOpacity>
                    <View style={{ height: 50 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// STYLE - Skopiowane z Twojego AddTripScreen dla 100% spójności
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f4f4f5',
        paddingTop: Platform.OS === 'android' ? 45 : 12
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
    submitButton: { backgroundColor: '#18181b', borderRadius: 24, padding: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
    submitText: { color: '#fff', fontWeight: '900', fontSize: 13, letterSpacing: 2 }
});