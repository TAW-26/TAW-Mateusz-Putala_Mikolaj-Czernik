import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Alert,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import {
    Compass,
    LogOut,
    MapPin,
    Plus,
    User,
    Heart,
    Trash2,
    Wallet,
    ArrowRight,
} from 'lucide-react-native';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { useFocusEffect } from '@react-navigation/native';
import { BrandMark } from '../components/ui/BrandMark';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius } from '../theme/tokens';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Trip {
    _id: string;
    title: string;
    origin?: { address: string };
    destination?: { address: string };
    isFavorite?: boolean;
    budget?: number;
    startDate?: string;
}

function formatTripCount(n: number): string {
    if (n === 1) return '1 wycieczka';
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} wycieczki`;
    return `${n} wycieczek`;
}

export default function HomeScreen({ navigation }: any) {
    const { colors, common, headerTop, spacing: themeSpacing } = useTheme();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const logout = useAuthStore((state) => state.logout);

    const loadTrips = async () => {
        try {
            const res = await api.get('/trips');
            const data = res.data.data || res.data || [];
            setTrips(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Błąd API:', err.response?.data || err.message);
            Alert.alert('Problem z połączeniem', 'Nie udało się pobrać wycieczek.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTrips();
        }, []),
    );

    const toggleFilter = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowFavoritesOnly(!showFavoritesOnly);
    };

    const toggleFavorite = async (tripId: string, currentStatus: boolean) => {
        try {
            setTrips((prev) =>
                prev.map((t) => (t._id === tripId ? { ...t, isFavorite: !currentStatus } : t)),
            );
            await api.put(`/trips/${tripId}`, { isFavorite: !currentStatus });
        } catch {
            Alert.alert('Błąd', 'Nie udało się zaktualizować ulubionych.');
            loadTrips();
        }
    };

    const deleteTrip = (tripId: string) => {
        Alert.alert('Usuń wycieczkę', 'Czy na pewno chcesz usunąć tę wycieczkę?', [
            { text: 'Anuluj', style: 'cancel' },
            {
                text: 'Usuń',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/trips/${tripId}`);
                        setTrips((prev) => prev.filter((t) => t._id !== tripId));
                    } catch {
                        Alert.alert('Błąd', 'Nie udało się usunąć wycieczki.');
                    }
                },
            },
        ]);
    };

    const displayedTrips = showFavoritesOnly ? trips.filter((t) => t.isFavorite) : trips;

    return (
        <SafeAreaView style={common.screen}>
            <ScrollView
                contentContainerStyle={[styles.scroll, { paddingTop: headerTop + themeSpacing.lg }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.topBar}>
                    <View style={styles.topBarRow}>
                        <BrandMark size="sm" />
                        <View style={styles.topActions}>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={[common.iconBtn, styles.topIconBtn]}>
                                <User size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => logout()} style={[styles.logoutBtn, { backgroundColor: colors.roseBg, borderColor: colors.roseBorder }]}>
                                <LogOut size={20} color={colors.rose} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={[styles.brandTitle, { color: colors.text }]}>Smart Voyager</Text>
                </View>

                <View style={styles.hero}>
                    <Text style={common.pageTitle}>
                        {showFavoritesOnly ? 'Ulubione wycieczki' : 'Twoje wycieczki'}
                    </Text>
                    <Text style={common.pageSubtitle}>
                        {loading ? 'Ładowanie…' : formatTripCount(displayedTrips.length)}
                    </Text>
                </View>

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        onPress={toggleFilter}
                        style={[common.secondaryBtn, showFavoritesOnly && { backgroundColor: colors.roseBg, borderColor: colors.roseBorder }]}
                    >
                        <Heart
                            size={16}
                            color={showFavoritesOnly ? colors.rose : colors.textMuted}
                            fill={showFavoritesOnly ? colors.rose : 'none'}
                        />
                        <Text style={[common.secondaryBtnText, showFavoritesOnly && { color: colors.rose }]}>
                            Ulubione
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={common.primaryBtn} onPress={() => navigation.navigate('AddTrip')}>
                        <Plus size={16} color={colors.onAccent} />
                        <Text style={common.primaryBtnText}>Nowa wycieczka</Text>
                    </TouchableOpacity>
                </View>

                {!showFavoritesOnly && !loading && trips.length === 0 && (
                    <View style={common.card}>
                        <Text style={common.sectionTitle}>Zaplanuj pierwszą wycieczkę</Text>
                        <Text style={[styles.emptyHint, { color: colors.textMuted }]}>
                            Utwórz wycieczkę, a AI zaproponuje przystanki na podstawie Twoich preferencji.
                        </Text>
                        <TouchableOpacity style={[common.primaryBtn, { marginTop: 12 }]} onPress={() => navigation.navigate('AddTrip')}>
                            <Plus size={16} color={colors.onAccent} />
                            <Text style={common.primaryBtnText}>Utwórz wycieczkę</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {loading ? (
                    <ActivityIndicator color={colors.textMuted} size="large" style={{ marginTop: 40 }} />
                ) : (
                    displayedTrips.map((trip) => (
                        <TouchableOpacity
                            key={trip._id}
                            style={[styles.tripCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('TripDetails', { id: trip._id })}
                        >
                            <View style={[styles.tripIcon, { backgroundColor: colors.elevated }]}>
                                <MapPin size={18} color={colors.textSecondary} />
                            </View>

                            <View style={styles.tripBody}>
                                <Text style={[styles.tripTitle, { color: colors.text }]} numberOfLines={1}>{trip.title}</Text>
                                <Text style={[styles.tripRoute, { color: colors.textMuted }]} numberOfLines={1}>
                                    {trip.destination?.address || 'Brak celu'}
                                </Text>
                                <View style={styles.tripMeta}>
                                    <Wallet size={13} color={colors.textMuted} />
                                    <Text style={[styles.tripBudget, { color: colors.textSecondary }]}>{trip.budget || 0} PLN</Text>
                                    <ArrowRight size={14} color={colors.textMuted} style={{ marginLeft: 'auto' }} />
                                </View>
                            </View>

                            <View style={styles.tripActions}>
                                <TouchableOpacity
                                    onPress={() => toggleFavorite(trip._id, !!trip.isFavorite)}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Heart
                                        size={20}
                                        color={trip.isFavorite ? colors.rose : colors.border}
                                        fill={trip.isFavorite ? colors.rose : 'none'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => deleteTrip(trip._id)}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Trash2 size={18} color={colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                {!loading && displayedTrips.length === 0 && trips.length > 0 && (
                    <View style={styles.emptyState}>
                        <Compass size={36} color={colors.border} />
                        <Text style={[styles.emptyText, { color: colors.textMuted }]}>Brak ulubionych wycieczek.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 40,
    },
    topBar: {
        marginBottom: spacing.lg,
    },
    topBarRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brandTitle: {
        fontSize: 22,
        fontWeight: '600',
        letterSpacing: -0.3,
        marginTop: spacing.sm,
    },
    topActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    topIconBtn: {
        width: 40,
        height: 40,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
        borderWidth: 1,
    },
    hero: { marginBottom: spacing.md },
    actionsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    emptyHint: {
        fontSize: 14,
        marginTop: 6,
        lineHeight: 20,
    },
    tripCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: radius.lg,
        borderWidth: 1,
        padding: spacing.md,
        marginBottom: spacing.sm,
        gap: spacing.sm,
    },
    tripIcon: {
        width: 40,
        height: 40,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tripBody: { flex: 1 },
    tripTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    tripRoute: {
        fontSize: 13,
        marginBottom: 8,
    },
    tripMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    tripBudget: {
        fontSize: 13,
        fontWeight: '500',
    },
    tripActions: {
        flexDirection: 'row',
        gap: 10,
        paddingTop: 4,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 48,
        gap: 12,
    },
    emptyText: {
        fontSize: 14,
    },
});
