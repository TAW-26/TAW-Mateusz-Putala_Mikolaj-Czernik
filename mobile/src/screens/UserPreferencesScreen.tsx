import React, { useState, useEffect, useMemo } from 'react';
import {
    StyleSheet, Text, View, ScrollView, TouchableOpacity,
    SafeAreaView, ActivityIndicator, Alert, TextInput,
} from 'react-native';
import {
    Sparkles, Zap, Building2, LibraryBig,
    Palmtree, Utensils, Compass, Map, Globe2, CheckCircle2,
} from 'lucide-react-native';
import api from '../api/axiosInstance';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useTheme } from '../context/ThemeContext';

const interestCategories = [
    {
        name: 'Architektura',
        icon: Building2,
        options: [
            { id: 'architektura_zabytkowa', label: 'Zabytkowa' },
            { id: 'architektura_nowoczesna', label: 'Modernizm' },
            { id: 'brutalizm', label: 'Brutalizm' },
            { id: 'industrializm', label: 'Industrial' },
            { id: 'sakralna', label: 'Sakralna' },
            { id: 'urbanistyka', label: 'Urbanistyka' },
        ],
    },
    {
        name: 'Historia i sztuka',
        icon: LibraryBig,
        options: [
            { id: 'muzea_sztuki', label: 'Galerie' },
            { id: 'muzea_techniki', label: 'Technika' },
            { id: 'historia_wojenna', label: 'Historia wojenna' },
            { id: 'archeologia', label: 'Archeologia' },
            { id: 'sredniowiecze', label: 'Średniowiecze' },
            { id: 'renesans_barok', label: 'Renesans' },
            { id: 'lokalny_folklor', label: 'Folklor' },
        ],
    },
    {
        name: 'Natura',
        icon: Palmtree,
        options: [
            { id: 'parki_narodowe', label: 'Parki narodowe' },
            { id: 'góry', label: 'Góry' },
            { id: 'jeziora_i_rzeki', label: 'Jeziora i rzeki' },
            { id: 'gory_hiking', label: 'Wędrówki' },
            { id: 'natura_parki', label: 'Parki miejskie' },
            { id: 'wybrzeze_plaze', label: 'Plaże' },
            { id: 'jaskinie', label: 'Jaskinie' },
        ],
    },
    {
        name: 'Jedzenie',
        icon: Utensils,
        options: [
            { id: 'kuchnia_lokalna', label: 'Lokalna' },
            { id: 'street_food', label: 'Street food' },
            { id: 'kawiarnie', label: 'Kawiarnie' },
            { id: 'winiarnie_browary', label: 'Winnice' },
            { id: 'opcje_wege', label: 'Wege' },
            { id: 'fine_dining', label: 'Fine dining' },
            { id: 'targi_rolnicze', label: 'Targi' },
        ],
    },
    {
        name: 'Aktywność',
        icon: Compass,
        options: [
            { id: 'punkty_widokowe', label: 'Widoki' },
            { id: 'fotografia', label: 'Fotografia' },
            { id: 'zycie_nocne', label: 'Nocne życie' },
            { id: 'zakupy', label: 'Zakupy' },
            { id: 'relaks_spa', label: 'Wellness' },
            { id: 'technologia', label: 'Technologia' },
            { id: 'sporty_ekstremalne', label: 'Ekstremalne' },
        ],
    },
];

const travelStyleOptions = [
    { id: 'avoidPaidAttractions', label: 'Unikaj płatnych' },
    { id: 'onlyHiddenGems', label: 'Ukryte perełki' },
    { id: 'kidFriendly', label: 'Rodzinne' },
    { id: 'disabilityAccess', label: 'Dostępność' },
    { id: 'preferWalking', label: 'Chodzenie' },
];

export default function UserPreferencesScreen({ navigation }: any) {
    const { colors, common, spacing, radius } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState<any>({
        interests: [],
        travelStyle: {},
        personalNotes: '',
    });

    useEffect(() => {
        api.get('/auth/profile')
            .then((res) => {
                if (res.data.user.preferences) setPreferences(res.data.user.preferences);
            })
            .catch(() => Alert.alert('Błąd', 'Nie udało się pobrać preferencji.'))
            .finally(() => setLoading(false));
    }, []);

    const toggleInterest = (id: string) => {
        const current = preferences.interests || [];
        const next = current.includes(id) ? current.filter((i: string) => i !== id) : [...current, id];
        setPreferences({ ...preferences, interests: next });
    };

    const toggleStyle = (id: string) => {
        setPreferences({
            ...preferences,
            travelStyle: { ...preferences.travelStyle, [id]: !preferences.travelStyle?.[id] },
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/auth/profile', { preferences });
            Alert.alert('Sukces', 'Preferencje zapisane.');
            navigation.goBack();
        } catch {
            Alert.alert('Błąd', 'Synchronizacja nie powiodła się.');
        } finally {
            setSaving(false);
        }
    };

    const styles = useMemo(() => StyleSheet.create({
        scroll: { padding: spacing.lg, paddingBottom: 40 },
        sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md },
        catBox: { marginBottom: spacing.md },
        catTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
        catName: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
        chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
        chip: {
            flexDirection: 'row', alignItems: 'center', gap: 4,
            paddingHorizontal: 12, paddingVertical: 8,
            borderRadius: radius.md, backgroundColor: colors.surface,
            borderWidth: 1, borderColor: colors.border,
        },
        chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
        chipText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
        chipTextActive: { color: colors.onAccent },
        chipStyleActive: { backgroundColor: colors.emeraldBg, borderColor: colors.emerald },
        chipStyleTextActive: { color: colors.emerald },
        textArea: {
            backgroundColor: colors.surface, borderRadius: radius.lg,
            borderWidth: 1, borderColor: colors.border,
            padding: spacing.md, minHeight: 100, textAlignVertical: 'top',
            fontSize: 14, color: colors.text,
        },
    }), [colors, spacing, radius]);

    if (loading) {
        return (
            <View style={common.centered}>
                <ActivityIndicator size="large" color={colors.textMuted} />
            </View>
        );
    }

    return (
        <SafeAreaView style={common.screen}>
            <ScreenHeader
                title="Preferencje podróży"
                onBack={() => navigation.goBack()}
                right={
                    <TouchableOpacity onPress={handleSave} disabled={saving} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                        {saving ? <ActivityIndicator size="small" color={colors.text} /> : <Zap size={22} color={colors.text} />}
                    </TouchableOpacity>
                }
            />

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionHeader}>
                    <Sparkles size={18} color={colors.textSecondary} />
                    <Text style={common.sectionTitle}>Zainteresowania</Text>
                </View>

                {interestCategories.map((cat) => (
                    <View key={cat.name} style={styles.catBox}>
                        <View style={styles.catTitleRow}>
                            <cat.icon size={14} color={colors.textMuted} />
                            <Text style={styles.catName}>{cat.name}</Text>
                        </View>
                        <View style={styles.chipGrid}>
                            {cat.options.map((opt) => {
                                const active = preferences.interests?.includes(opt.id);
                                return (
                                    <TouchableOpacity
                                        key={opt.id}
                                        onPress={() => toggleInterest(opt.id)}
                                        style={[styles.chip, active && styles.chipActive]}
                                    >
                                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
                                        {active && <CheckCircle2 size={12} color="#fff" />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}

                <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
                    <Map size={18} color={colors.textSecondary} />
                    <Text style={common.sectionTitle}>Styl podróży</Text>
                </View>
                <View style={styles.chipGrid}>
                    {travelStyleOptions.map((opt) => {
                        const active = preferences.travelStyle?.[opt.id];
                        return (
                            <TouchableOpacity
                                key={opt.id}
                                onPress={() => toggleStyle(opt.id)}
                                style={[styles.chip, active && styles.chipStyleActive]}
                            >
                                <Text style={[styles.chipText, active && styles.chipStyleTextActive]}>{opt.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
                    <Globe2 size={18} color={colors.textSecondary} />
                    <Text style={common.sectionTitle}>Notatki osobiste</Text>
                </View>
                <TextInput
                    style={styles.textArea}
                    multiline
                    placeholder="np. Zawsze proponuj restauracje wegańskie..."
                    placeholderTextColor={colors.textMuted}
                    value={preferences.personalNotes}
                    onChangeText={(txt) => setPreferences({ ...preferences, personalNotes: txt })}
                />

                <TouchableOpacity style={[common.primaryBtn, { marginTop: spacing.lg }, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
                    <Text style={common.primaryBtnText}>Zapisz zmiany</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
