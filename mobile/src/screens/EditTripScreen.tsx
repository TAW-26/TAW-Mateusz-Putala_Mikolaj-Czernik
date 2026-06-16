import React, { useEffect, useState, useMemo } from 'react';
import {
    StyleSheet, Text, View, TextInput, ScrollView,
    TouchableOpacity, SafeAreaView, ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform,
} from 'react-native';
import {
    Save, Sparkles, Minus, Plus,
    Calendar as CalendarIcon, MapPin, Flag, MessageSquare, Banknote,
} from 'lucide-react-native';
import { tripsService } from '../api/tripsService';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useTheme } from '../context/ThemeContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function EditTripScreen({ route, navigation }: any) {
    const { colors, common, spacing, radius } = useTheme();
    const { id } = route.params;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
        aiSettings: { intensity: 5, discoverySpread: 5, numberOfPoints: 10 },
    });

    useEffect(() => {
        tripsService.getTripDetails(id)
            .then((res) => {
                const trip = res.data || res;
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
                    aiSettings: trip.aiSettings || { intensity: 5, discoverySpread: 5, numberOfPoints: 10 },
                });
            })
            .catch(() => {
                Alert.alert('Błąd', 'Nie udało się pobrać danych wycieczki.');
                navigation.goBack();
            })
            .finally(() => setLoading(false));
    }, [id]);

    const updateAiSetting = (key: string, delta: number, min: number, max: number) => {
        setFormData((prev) => ({
            ...prev,
            aiSettings: {
                ...prev.aiSettings,
                [key]: Math.min(max, Math.max(min, (prev.aiSettings as any)[key] + delta)),
            },
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await tripsService.updateTrip(id, { ...formData, budget: Number(formData.budget) || 0 });
            Alert.alert('Sukces', 'Wycieczka zaktualizowana.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        } catch {
            Alert.alert('Błąd', 'Aktualizacja nie powiodła się.');
        } finally {
            setSaving(false);
        }
    };

    const styles = useMemo(() => StyleSheet.create({
        scroll: { padding: spacing.lg, paddingBottom: 40 },
        field: { marginBottom: spacing.md },
        row: { flexDirection: 'row', gap: spacing.sm },
        inputIcon: {
            flexDirection: 'row', alignItems: 'center', gap: 10,
            backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
            borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12,
        },
        flexInput: { flex: 1, fontSize: 15, color: colors.text },
        textareaWrap: { alignItems: 'flex-start' },
        textarea: { minHeight: 80, textAlignVertical: 'top' },
        aiCard: {
            backgroundColor: colors.elevated, borderRadius: radius.lg,
            borderWidth: 1, borderColor: colors.border, padding: spacing.md,
            marginBottom: spacing.lg, gap: spacing.md,
        },
        aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
        aiTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
        settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        settingTitle: { fontSize: 14, fontWeight: '500', color: colors.text },
        settingSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
        stepper: { flexDirection: 'row', gap: 8 },
        stepBtn: {
            width: 36, height: 36, borderRadius: radius.sm,
            backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
            alignItems: 'center', justifyContent: 'center',
        },
    }), [colors, spacing, radius]);

    if (loading) return <View style={common.centered}><ActivityIndicator color={colors.textMuted} size="large" /></View>;

    const Stepper = ({ label, sub, onMinus, onPlus }: any) => (
        <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
                <Text style={styles.settingTitle}>{label}</Text>
                <Text style={styles.settingSub}>{sub}</Text>
            </View>
            <View style={styles.stepper}>
                <TouchableOpacity onPress={onMinus} style={styles.stepBtn}><Minus size={16} color={colors.text} /></TouchableOpacity>
                <TouchableOpacity onPress={onPlus} style={styles.stepBtn}><Plus size={16} color={colors.text} /></TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={common.screen}>
            <ScreenHeader title="Edytuj wycieczkę" onBack={() => navigation.goBack()} centerTitle />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.field}>
                        <Text style={common.label}>Tytuł wycieczki</Text>
                        <TextInput style={common.input} value={formData.title} onChangeText={(txt) => setFormData({ ...formData, title: txt })} />
                    </View>

                    <View style={styles.field}>
                        <Text style={common.label}>Punkt startowy</Text>
                        <View style={styles.inputIcon}>
                            <MapPin size={18} color={colors.textMuted} />
                            <TextInput style={styles.flexInput} value={formData.origin.address} onChangeText={(txt) => setFormData({ ...formData, origin: { address: txt } })} />
                        </View>
                    </View>

                    <View style={styles.field}>
                        <Text style={common.label}>Cel podróży</Text>
                        <View style={styles.inputIcon}>
                            <Flag size={18} color={colors.textMuted} />
                            <TextInput style={styles.flexInput} value={formData.destination.address} onChangeText={(txt) => setFormData({ ...formData, destination: { address: txt } })} />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.field, { flex: 1 }]}>
                            <Text style={common.label}>Data rozpoczęcia</Text>
                            <TouchableOpacity style={styles.inputIcon} onPress={() => setStartPickerVisibility(true)}>
                                <CalendarIcon size={18} color={colors.textMuted} />
                                <Text style={styles.flexInput}>{formData.startDate || 'Wybierz datę'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.field, { flex: 1 }]}>
                            <Text style={common.label}>Data zakończenia</Text>
                            <TouchableOpacity style={styles.inputIcon} onPress={() => setEndPickerVisibility(true)}>
                                <CalendarIcon size={18} color={colors.textMuted} />
                                <Text style={styles.flexInput}>{formData.endDate || 'Wybierz datę'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <DateTimePickerModal isVisible={isStartPickerVisible} mode="date" onConfirm={(d) => { setFormData({ ...formData, startDate: d.toISOString().split('T')[0] }); setStartPickerVisibility(false); }} onCancel={() => setStartPickerVisibility(false)} />
                    <DateTimePickerModal isVisible={isEndPickerVisible} mode="date" onConfirm={(d) => { setFormData({ ...formData, endDate: d.toISOString().split('T')[0] }); setEndPickerVisibility(false); }} onCancel={() => setEndPickerVisibility(false)} />

                    <View style={styles.field}>
                        <Text style={common.label}>Specjalne wymagania</Text>
                        <View style={[styles.inputIcon, styles.textareaWrap]}>
                            <MessageSquare size={18} color={colors.textMuted} style={{ marginTop: 2 }} />
                            <TextInput style={[styles.flexInput, styles.textarea]} multiline value={formData.description} onChangeText={(txt) => setFormData({ ...formData, description: txt })} />
                        </View>
                    </View>

                    <View style={styles.aiCard}>
                        <View style={styles.aiHeader}>
                            <Sparkles size={16} color={colors.textSecondary} />
                            <Text style={styles.aiTitle}>Ustawienia AI</Text>
                        </View>
                        <Stepper label="Intensywność" sub={`${formData.aiSettings.intensity}/10`} onMinus={() => updateAiSetting('intensity', -1, 0, 10)} onPlus={() => updateAiSetting('intensity', 1, 0, 10)} />
                        <Stepper label="Zasięg eksploracji" sub={`${formData.aiSettings.discoverySpread}/10`} onMinus={() => updateAiSetting('discoverySpread', -1, 0, 10)} onPlus={() => updateAiSetting('discoverySpread', 1, 0, 10)} />
                        <Stepper label="Liczba przystanków" sub={`${formData.aiSettings.numberOfPoints}`} onMinus={() => updateAiSetting('numberOfPoints', -1, 1, 20)} onPlus={() => updateAiSetting('numberOfPoints', 1, 1, 20)} />
                        <View style={styles.field}>
                            <Text style={common.label}>Budżet (PLN)</Text>
                            <View style={styles.inputIcon}>
                                <Banknote size={18} color={colors.textMuted} />
                                <TextInput keyboardType="numeric" style={styles.flexInput} value={formData.budget} onChangeText={(v) => setFormData({ ...formData, budget: v })} />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={[common.primaryBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
                        {saving ? <ActivityIndicator color={colors.onAccent} /> : (
                            <>
                                <Text style={common.primaryBtnText}>Zapisz zmiany</Text>
                                <Save size={18} color={colors.onAccent} />
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
