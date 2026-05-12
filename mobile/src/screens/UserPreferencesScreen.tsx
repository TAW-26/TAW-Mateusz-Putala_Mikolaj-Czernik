import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, ScrollView, TouchableOpacity,
    SafeAreaView, ActivityIndicator, Alert, Platform, TextInput
} from 'react-native';
import {
    ChevronLeft, Sparkles, Zap, Building2, LibraryBig,
    Palmtree, Utensils, Compass, Map, Globe2, CheckCircle2
} from 'lucide-react-native';
import api from '../api/axiosInstance';

export default function UserPreferencesScreen({ navigation }: any) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState<any>({
        interests: [],
        travelStyle: {},
        personalNotes: ""
    });

    // PEŁNA LISTA KATEGORII I OPCJI Z WERSJI WEB
    const interestCategories = [
        {
            name: 'Architecture',
            icon: Building2,
            options: [
                { id: 'architektura_zabytkowa', label: 'Historic' },
                { id: 'architektura_nowoczesna', label: 'Modernism' },
                { id: 'brutalizm', label: 'Brutalism' },
                { id: 'industrializm', label: 'Industrial' },
                { id: 'sakralna', label: 'Sacred Spaces' },
                { id: 'urbanistyka', label: 'Urban Planning' }
            ]
        },
        {
            name: 'History & Art',
            icon: LibraryBig,
            options: [
                { id: 'muzea_sztuki', label: 'Art Galleries' },
                { id: 'muzea_techniki', label: 'Tech & Eng' },
                { id: 'historia_wojenna', label: 'War History' },
                { id: 'archeologia', label: 'Archaeological' },
                { id: 'sredniowiecze', label: 'Medieval' },
                { id: 'renesans_barok', label: 'Renaissance' },
                { id: 'lokalny_folklor', label: 'Local Folklore' }
            ]
        },
        {
            name: 'Nature & Outdoors',
            icon: Palmtree,
            options: [
                { id: 'parki_narodowe', label: 'National Parks' },
                { id: 'góry', label: 'High Mountains' },
                { id: 'jeziora_i_rzeki', label: 'Lakes & Rivers' },
                { id: 'gory_hiking', label: 'Hiking' },
                { id: 'natura_parki', label: 'City Nature' },
                { id: 'wybrzeze_plaze', label: 'Beaches' },
                { id: 'jaskinie', label: 'Caves' }
            ]
        },
        {
            name: 'Food & Drink',
            icon: Utensils,
            options: [
                { id: 'kuchnia_lokalna', label: 'Local Gastro' },
                { id: 'street_food', label: 'Street Food' },
                { id: 'kawiarnie', label: 'Café Culture' },
                { id: 'winiarnie_browary', label: 'Wineries' },
                { id: 'opcje_wege', label: 'Vegan' },
                { id: 'fine_dining', label: 'Fine Dining' },
                { id: 'targi_rolnicze', label: 'Markets' }
            ]
        },
        {
            name: 'Lifestyle & Activity',
            icon: Compass,
            options: [
                { id: 'punkty_widokowe', label: 'Photo Spots' },
                { id: 'fotografia', label: 'Photography' },
                { id: 'zycie_nocne', label: 'Nightlife' },
                { id: 'zakupy', label: 'Shopping' },
                { id: 'relaks_spa', label: 'Wellness' },
                { id: 'technologia', label: 'Future Tech' },
                { id: 'sporty_ekstremalne', label: 'Extreme' }
            ]
        }
    ];

    const travelStyleOptions = [
        { id: 'avoidPaidAttractions', label: 'Avoid Paid' },
        { id: 'onlyHiddenGems', label: 'Only Hidden Gems' },
        { id: 'kidFriendly', label: 'Family Friendly' },
        { id: 'disabilityAccess', label: 'Disability Access' },
        { id: 'preferWalking', label: 'Prefer Walking' }
    ];

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            const res = await api.get('/auth/profile');
            if (res.data.user.preferences) {
                setPreferences(res.data.user.preferences);
            }
        } catch (err) {
            Alert.alert("Error", "Failed to fetch neural protocol.");
        } finally {
            setLoading(false);
        }
    };

    const toggleInterest = (id: string) => {
        const current = preferences.interests || [];
        const next = current.includes(id) ? current.filter((i: string) => i !== id) : [...current, id];
        setPreferences({ ...preferences, interests: next });
    };

    const toggleStyle = (id: string) => {
        setPreferences({
            ...preferences,
            travelStyle: { ...preferences.travelStyle, [id]: !preferences.travelStyle[id] }
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/auth/profile', { preferences });
            Alert.alert("Success", "Voyager Protocol Synchronized.");
            navigation.goBack();
        } catch (err) {
            Alert.alert("Sync Error", "Connection failed.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft color="#18181b" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Neural Protocol</Text>
                <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveIconBtn}>
                    {saving ? <ActivityIndicator size={20} color="#6366f1" /> : <Zap size={22} color="#6366f1" fill="#6366f1" />}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* 1. AI INTEREST ENGINE */}
                <View style={styles.sectionHeader}>
                    <Sparkles size={18} color="#6366f1" />
                    <Text style={styles.sectionTitle}>AI Preference Engine</Text>
                </View>

                {interestCategories.map((cat) => (
                    <View key={cat.name} style={styles.catBox}>
                        <View style={styles.catTitleRow}>
                            <cat.icon size={14} color="#71717a" />
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
                                        {active && <CheckCircle2 size={12} color="#fff" style={{marginLeft: 4}} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}

                {/* 2. TRAVEL LOGIC */}
                <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                    <Map size={18} color="#10b981" />
                    <Text style={styles.sectionTitle}>Travel Logic & Constraints</Text>
                </View>
                <View style={styles.chipGrid}>
                    {travelStyleOptions.map((opt) => {
                        const active = preferences.travelStyle?.[opt.id];
                        return (
                            <TouchableOpacity
                                key={opt.id}
                                onPress={() => toggleStyle(opt.id)}
                                style={[styles.logicChip, active && styles.logicChipActive]}
                            >
                                <Text style={[styles.logicChipText, active && styles.logicChipTextActive]}>{opt.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* 3. NEURAL DIRECTIVES */}
                <View style={[styles.sectionHeader, { marginTop: 30 }]}>
                    <Globe2 size={18} color="#a855f7" />
                    <Text style={styles.sectionTitle}>Neural Directives</Text>
                </View>
                <TextInput
                    style={styles.textArea}
                    multiline
                    placeholder="Example: Always suggest vegan restaurants or avoid steep stairs..."
                    placeholderTextColor="#a1a1aa"
                    value={preferences.personalNotes}
                    onChangeText={(txt) => setPreferences({...preferences, personalNotes: txt})}
                />

                <TouchableOpacity style={styles.applyBtn} onPress={handleSave} disabled={saving}>
                    <Text style={styles.applyBtnText}>APPLY PROTOCOL</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fcfcfc' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fcfcfc' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, paddingTop: Platform.OS === 'android' ? 45 : 10 },
    backBtn: { padding: 8, backgroundColor: '#f4f4f5', borderRadius: 12 },
    headerTitle: { fontSize: 18, fontWeight: '900', color: '#18181b', textTransform: 'uppercase', letterSpacing: 1 },
    saveIconBtn: { padding: 8 },
    scrollContent: { padding: 20 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
    sectionTitle: { fontSize: 14, fontWeight: '900', color: '#18181b', textTransform: 'uppercase', letterSpacing: 1 },
    catBox: { marginBottom: 20 },
    catTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, marginLeft: 4 },
    catName: { fontSize: 10, fontWeight: '800', color: '#71717a', textTransform: 'uppercase', letterSpacing: 1 },
    chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f4f4f5' },
    chipActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
    chipText: { fontSize: 11, fontWeight: '700', color: '#71717a' },
    chipTextActive: { color: '#fff' },
    logicChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: '#e4e4e7', backgroundColor: '#fff' },
    logicChipActive: { backgroundColor: '#ecfdf5', borderColor: '#10b981' },
    logicChipText: { fontSize: 10, fontWeight: '900', color: '#71717a', textTransform: 'uppercase' },
    logicChipTextActive: { color: '#059669' },
    textArea: { backgroundColor: '#fff', borderRadius: 20, padding: 16, height: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#f4f4f5', fontSize: 14, color: '#18181b' },
    applyBtn: { marginTop: 30, backgroundColor: '#18181b', padding: 20, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
    applyBtnText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 2 }
});