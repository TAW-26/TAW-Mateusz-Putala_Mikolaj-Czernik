import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    StyleSheet, Text, View, ScrollView, TouchableOpacity,
    ActivityIndicator, SafeAreaView, Alert, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import MapView from 'react-native-maps';
import {
    Sparkles, Trash2, CheckCircle2, MapPin, Heart, Pencil,
} from 'lucide-react-native';
import { tripsService } from '../api/tripsService';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { TripMap } from '../components/trips/TripMap';
import { useTheme } from '../context/ThemeContext';
import { toggleWaypointSpeech, stopSpeech } from '../utils/speech';
import { useFocusEffect } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TripDetailsScreen({ route, navigation }: any) {
    const { id } = route.params;
    const { colors, common, spacing, radius } = useTheme();
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const mapRef = useRef<MapView>(null);

    const loadData = useCallback(async () => {
        try {
            const res = await tripsService.getTripDetails(id);
            setTrip(res.data || res);
        } catch {
            Alert.alert('Błąd', 'Nie udało się wczytać wycieczki.');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    }, [id, navigation]);

    useEffect(() => { loadData(); }, [loadData]);

    useFocusEffect(
        useCallback(() => () => stopSpeech(), []),
    );

    const toggleFavorite = async () => {
        try {
            const newStatus = !trip.isFavorite;
            setTrip((prev: any) => ({ ...prev, isFavorite: newStatus }));
            await tripsService.updateTrip(id, { isFavorite: newStatus });
        } catch {
            setTrip((prev: any) => ({ ...prev, isFavorite: !prev.isFavorite }));
            Alert.alert('Błąd', 'Nie udało się zaktualizować ulubionych.');
        }
    };

    const handleWaypointPress = (wp: any, index: number) => {
        const lat = wp.location?.lat || wp.lat;
        const lng = wp.location?.lng || wp.lng;
        if (mapRef.current && lat && lng) {
            mapRef.current.animateToRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 800);
        }
        toggleWaypointSpeech(wp, wp._id || String(index));
    };

    const toggleDescription = (wpId: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId((prev) => (prev === wpId ? null : wpId));
    };

    const handleGenerateAI = async () => {
        setIsGenerating(true);
        try {
            await tripsService.generateAIWaypoints(id);
            await loadData();
            Alert.alert('Sukces', 'Trasa wygenerowana pomyślnie.');
        } catch (err: any) {
            Alert.alert('Błąd AI', err.message || 'Generowanie nie powiodło się.');
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleVisited = async (wp: any) => {
        try {
            const newStatus = !wp.visited;
            await tripsService.updateWaypoint(wp._id, { visited: newStatus });
            setTrip((prev: any) => ({
                ...prev,
                waypoints: prev.waypoints.map((w: any) =>
                    w._id === wp._id ? { ...w, visited: newStatus } : w,
                ),
            }));
        } catch {
            Alert.alert('Błąd', 'Nie udało się zaktualizować statusu punktu.');
        }
    };

    const deleteWaypoint = (wpId: string) => {
        Alert.alert('Usuń punkt', 'Usunąć ten punkt trasy?', [
            { text: 'Anuluj', style: 'cancel' },
            {
                text: 'Usuń',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await tripsService.deleteWaypoint(wpId);
                        setTrip((prev: any) => ({
                            ...prev,
                            waypoints: prev.waypoints.filter((w: any) => w._id !== wpId),
                        }));
                    } catch {
                        Alert.alert('Błąd', 'Usuwanie nie powiodło się.');
                    }
                },
            },
        ]);
    };

    if (loading || !trip) {
        return (
            <View style={common.centered}>
                <ActivityIndicator color={colors.textMuted} size="large" />
            </View>
        );
    }

    const headerRight = (
        <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggleFavorite} style={[common.iconBtn, styles.headerIconBtn]}>
                <Heart
                    size={18}
                    color={trip.isFavorite ? colors.rose : colors.textSecondary}
                    fill={trip.isFavorite ? colors.rose : 'none'}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('EditTrip', { id })} style={[common.iconBtn, styles.headerIconBtn]}>
                <Pencil size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleGenerateAI}
                disabled={isGenerating}
                style={[common.primaryBtn, styles.headerGenBtn, isGenerating && { opacity: 0.6 }]}
            >
                {isGenerating ? (
                    <ActivityIndicator size="small" color={colors.onAccent} />
                ) : (
                    <Sparkles size={18} color={colors.onAccent} />
                )}
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={common.screen}>
            <ScreenHeader
                title={trip.title}
                subtitle={`${trip.origin?.address} → ${trip.destination?.address}`}
                onBack={() => navigation.goBack()}
                right={headerRight}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
                    <TripMap
                        ref={mapRef}
                        waypoints={trip.waypoints || []}
                        routeLineColor={colors.routeLine}
                        mapBg={colors.elevated}
                    />
                </View>

                <View style={{ padding: spacing.lg }}>
                    <View style={styles.sectionRow}>
                        <Text style={common.sectionTitle}>Punkty trasy</Text>
                        <TouchableOpacity onPress={handleGenerateAI} disabled={isGenerating} style={styles.genLink}>
                            <Sparkles size={14} color={colors.textSecondary} />
                            <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '500' }}>
                                {isGenerating ? 'Generowanie…' : 'Generuj trasę'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {trip.waypoints?.length === 0 && (
                        <View style={common.card}>
                            <Text style={{ fontSize: 14, color: colors.textMuted, lineHeight: 20 }}>
                                Brak punktów trasy. Użyj „Generuj trasę”, aby utworzyć plan.
                            </Text>
                        </View>
                    )}

                    {trip.waypoints?.map((wp: any, index: number) => {
                        const isExpanded = expandedId === wp._id;
                        return (
                            <TouchableOpacity
                                key={wp._id || index}
                                style={[styles.wpCard, {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    borderRadius: radius.lg,
                                }, wp.visited && { opacity: 0.65 }]}
                                onPress={() => handleWaypointPress(wp, index)}
                                onLongPress={() => toggleDescription(wp._id)}
                                delayLongPress={350}
                                activeOpacity={0.85}
                            >
                                <TouchableOpacity
                                    onPress={() => toggleVisited(wp)}
                                    style={[styles.wpBadge, {
                                        backgroundColor: wp.visited ? colors.emerald : colors.elevated,
                                        borderColor: wp.visited ? colors.emerald : colors.border,
                                    }]}
                                >
                                    {wp.visited ? (
                                        <CheckCircle2 size={16} color="#fff" />
                                    ) : (
                                        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textMuted }}>
                                            {index + 1}
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <View style={{ flex: 1 }}>
                                    <View style={styles.wpHeader}>
                                        <Text
                                            style={[{
                                                fontSize: 15,
                                                fontWeight: '600',
                                                color: colors.text,
                                                flex: 1,
                                            }, wp.visited && { textDecorationLine: 'line-through', color: colors.textMuted }]}
                                            numberOfLines={2}
                                        >
                                            {wp.name}
                                        </Text>
                                        <TouchableOpacity onPress={() => deleteWaypoint(wp._id)}>
                                            <Trash2 size={16} color={colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                    {wp.address ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                            <MapPin size={11} color={colors.textMuted} />
                                            <Text style={{ fontSize: 12, color: colors.textMuted, flex: 1 }} numberOfLines={1}>
                                                {wp.address}
                                            </Text>
                                        </View>
                                    ) : null}
                                    {wp.description ? (
                                        <Text
                                            style={{ fontSize: 13, color: colors.textSecondary, marginTop: 6, lineHeight: 18 }}
                                            numberOfLines={isExpanded ? undefined : 2}
                                        >
                                            {wp.description}
                                        </Text>
                                    ) : null}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerIconBtn: {
        width: 40,
        height: 40,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerGenBtn: {
        width: 40,
        height: 40,
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    sectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    genLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    wpCard: {
        flexDirection: 'row',
        gap: 8,
        borderWidth: 1,
        padding: 16,
        marginBottom: 8,
    },
    wpBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wpHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
});
