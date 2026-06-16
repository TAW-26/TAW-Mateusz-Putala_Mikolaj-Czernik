import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Sun, Moon, Monitor, Palette, LayoutGrid, Check,
} from 'lucide-react-native';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { useTheme, type ColorMode, type AccentColor, type Density } from '../context/ThemeContext';

const COLOR_MODES: { value: ColorMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Jasny', icon: Sun },
    { value: 'dark', label: 'Ciemny', icon: Moon },
    { value: 'system', label: 'Systemowy', icon: Monitor },
];

const ACCENTS: { value: AccentColor; label: string; color: string }[] = [
    { value: 'slate', label: 'Grafitowy', color: '#0f172a' },
    { value: 'blue', label: 'Niebieski', color: '#2563eb' },
    { value: 'violet', label: 'Fioletowy', color: '#7c3aed' },
    { value: 'emerald', label: 'Szmaragdowy', color: '#059669' },
    { value: 'rose', label: 'Różowy', color: '#e11d48' },
    { value: 'amber', label: 'Bursztynowy', color: '#d97706' },
];

const DENSITY_LABELS: Record<Density, string> = {
    comfortable: 'Komfortowy',
    compact: 'Kompaktowy',
};

export default function SettingsScreen({ navigation }: any) {
    const { colors, common, spacing, radius, settings, setColorMode, setAccent, setDensity } = useTheme();

    const optionStyle = (selected: boolean) => ({
        backgroundColor: selected ? colors.accentMuted : colors.surface,
        borderColor: selected ? colors.accent : colors.border,
    });

    const optionTextStyle = (selected: boolean) => ({
        color: selected ? colors.text : colors.textSecondary,
        fontWeight: selected ? '600' as const : '500' as const,
    });

    return (
        <SafeAreaView style={common.screen} edges={['top']}>
            <ScreenHeader title="Wygląd" onBack={() => navigation.goBack()} centerTitle />

            <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
                <View style={[common.card, { gap: spacing.md }]}>
                    <View style={styles.sectionLabelRow}>
                        <Palette size={16} color={colors.textMuted} />
                        <Text style={[common.sectionTitle, { color: colors.text }]}>Motyw</Text>
                    </View>
                    <View style={styles.row3}>
                        {COLOR_MODES.map((mode) => {
                            const selected = settings.colorMode === mode.value;
                            const Icon = mode.icon;
                            return (
                                <TouchableOpacity
                                    key={mode.value}
                                    onPress={() => setColorMode(mode.value)}
                                    style={[styles.optionBtn, optionStyle(selected)]}
                                >
                                    <Icon size={16} color={selected ? colors.accent : colors.textMuted} />
                                    <Text style={[styles.optionText, optionTextStyle(selected)]}>{mode.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={[common.card, { gap: spacing.md }]}>
                    <Text style={[common.sectionTitle, { color: colors.text }]}>Kolor akcentu</Text>
                    <View style={styles.accentGrid}>
                        {ACCENTS.map((accent) => {
                            const selected = settings.accent === accent.value;
                            return (
                                <TouchableOpacity
                                    key={accent.value}
                                    onPress={() => setAccent(accent.value)}
                                    style={[styles.accentBtn, optionStyle(selected)]}
                                >
                                    <View style={[styles.dot, { backgroundColor: accent.color }]} />
                                    <Text style={[styles.accentLabel, optionTextStyle(selected)]} numberOfLines={1}>
                                        {accent.label}
                                    </Text>
                                    {selected && <Check size={12} color={colors.accent} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={[common.card, { gap: spacing.md }]}>
                    <Text style={[common.sectionTitle, { color: colors.text }]}>Gęstość układu</Text>
                    <View style={styles.row2}>
                        {(['comfortable', 'compact'] as Density[]).map((d) => {
                            const selected = settings.density === d;
                            return (
                                <TouchableOpacity
                                    key={d}
                                    onPress={() => setDensity(d)}
                                    style={[styles.densityBtn, optionStyle(selected)]}
                                >
                                    <LayoutGrid size={14} color={selected ? colors.accent : colors.textMuted} />
                                    <Text style={[styles.optionText, optionTextStyle(selected)]}>
                                        {DENSITY_LABELS[d]}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    row3: { flexDirection: 'row', gap: 8 },
    row2: { flexDirection: 'row', gap: 8 },
    optionBtn: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    optionText: { fontSize: 12 },
    accentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    accentBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        width: '48%',
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    accentLabel: { fontSize: 12, flex: 1 },
    densityBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
});
