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
    LayoutAnimation, // Dodano dla płynnego przejścia
    Platform,
    UIManager
} from 'react-native';
import { Compass, Activity, LogOut, MapPin, Plus, User, Heart, Trash2, Filter } from 'lucide-react-native';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { useFocusEffect } from '@react-navigation/native';

// Włączenie animacji na Androidzie
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Trip {
    _id: string;
    title: string;
    origin?: { address: string };
    destination?: { address: string };
    isFavorite?: boolean;
}

export default function HomeScreen({ navigation }: any) {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // NOWY STAN FILTRA
    const logout = useAuthStore((state) => state.logout);

    const loadTrips = async () => {
        try {
            const res = await api.get('/trips');
            const data = res.data.data || res.data || [];
            setTrips(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Błąd API:", err.response?.data || err.message);
            Alert.alert("Problem z połączeniem", "Nie udało się pobrać wycieczek.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTrips();
        }, [])
    );

    // FUNKCJA: Przełączanie filtra
    const toggleFilter = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowFavoritesOnly(!showFavoritesOnly);
    };

    const toggleFavorite = async (tripId: string, currentStatus: boolean) => {
        try {
            setTrips(prev => prev.map(t =>
                t._id === tripId ? { ...t, isFavorite: !currentStatus } : t
            ));
            await api.put(`/trips/${tripId}`, { isFavorite: !currentStatus });
        } catch (err) {
            Alert.alert("Error", "Could not update favorite status.");
            loadTrips();
        }
    };

    const deleteTrip = (tripId: string) => {
        Alert.alert(
            "Terminate Mission",
            "Are you sure you want to delete this journey?",
            [
                { text: "Abort", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/trips/${tripId}`);
                            setTrips(prev => prev.filter(t => t._id !== tripId));
                        } catch (err) {
                            Alert.alert("Error", "Failed to delete expedition.");
                        }
                    }
                }
            ]
        );
    };

    // LOGIKA FILTROWANIA
    const displayedTrips = showFavoritesOnly
        ? trips.filter(t => t.isFavorite)
        : trips;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header - bez zmian */}
                <View style={styles.header}>
                    <View>
                        <View style={styles.badgeRow}>
                            <Activity size={12} color="#a1a1aa" />
                            <Text style={styles.badge}>LIVE DASHBOARD</Text>
                        </View>
                        <Text style={styles.title}>Your Journeys</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
                            <User size={22} color="#4f46e5" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => logout()} style={styles.logoutBtn}>
                            <LogOut size={22} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Statystyka i AI Card - bez zmian */}
                <View style={styles.statsCard}>
                    <Compass size={24} color="#18181b" style={{marginBottom: 8}} />
                    <Text style={styles.statsNumber}>{loading ? '...' : trips.length}</Text>
                    <Text style={styles.statsLabel}>Total Expeditions</Text>
                </View>

                <View style={styles.aiCard}>
                    <Text style={styles.aiTitle}>Ready for a new discovery?</Text>
                    <Text style={styles.aiSub}>Use Llama 3.3 to generate a new itinerary.</Text>
                    <TouchableOpacity style={styles.aiButton} onPress={() => navigation.navigate('AddTrip')}>
                        <Plus size={14} color="#18181b" style={{marginRight: 6}} />
                        <Text style={styles.aiButtonText}>GENERATE WITH AI</Text>
                    </TouchableOpacity>
                </View>

                {/* SEKCJA LISTY Z FILTREM */}
                <View style={styles.listHeader}>
                    <Text style={styles.sectionTitle}>
                        {showFavoritesOnly ? "Favorite Missions" : "Recent Trips"}
                    </Text>

                    <TouchableOpacity
                        onPress={toggleFilter}
                        style={[styles.filterBtn, showFavoritesOnly && styles.filterBtnActive]}
                    >
                        <Heart
                            size={14}
                            color={showFavoritesOnly ? "#fff" : "#71717a"}
                            fill={showFavoritesOnly ? "#fff" : "none"}
                            style={{ marginRight: 6 }}
                        />
                        <Text style={[styles.filterText, showFavoritesOnly && styles.filterTextActive]}>
                            {showFavoritesOnly ? "FILTERED" : "ALL"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator color="#18181b" size="large" />
                ) : (
                    displayedTrips.map((trip) => (
                        <TouchableOpacity
                            key={trip._id}
                            style={styles.tripCard}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('TripDetails', { id: trip._id })}
                        >
                            <View style={styles.tripHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.tripTitle}>{trip.title}</Text>
                                    <View style={styles.tripRoute}>
                                        <MapPin size={12} color="#71717a" style={{marginRight: 4}} />
                                        <Text style={styles.routeText} numberOfLines={1}>
                                            {trip.origin?.address || 'Start'} ➔ {trip.destination?.address || 'End'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.cardActions}>
                                    <TouchableOpacity
                                        onPress={() => toggleFavorite(trip._id, !!trip.isFavorite)}
                                        style={styles.cardIconBtn}
                                    >
                                        <Heart
                                            size={20}
                                            color={trip.isFavorite ? "#f43f5e" : "#e4e4e7"}
                                            fill={trip.isFavorite ? "#f43f5e" : "none"}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => deleteTrip(trip._id)}
                                        style={styles.cardIconBtn}
                                    >
                                        <Trash2 size={20} color="#e4e4e7" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                {/* KOMUNIKAT O BRAKU WYNIKÓW */}
                {!loading && displayedTrips.length === 0 && (
                    <View style={styles.emptyState}>
                        <Compass size={40} color="#e4e4e7" style={{ marginBottom: 12 }} />
                        <Text style={styles.emptyText}>
                            {showFavoritesOnly ? "No favorite missions in logs." : "No trips found."}
                        </Text>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // ... poprzednie style bez zmian ...
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 24 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    headerActions: { flexDirection: 'row', gap: 12 },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    badge: { fontSize: 10, fontWeight: '900', color: '#a1a1aa', letterSpacing: 2 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#18181b', letterSpacing: -1 },
    profileBtn: { padding: 10, backgroundColor: '#eef2ff', borderRadius: 14 },
    logoutBtn: { padding: 10, backgroundColor: '#fef2f2', borderRadius: 14 },
    statsCard: { backgroundColor: '#f4f4f5', padding: 24, borderRadius: 30, marginBottom: 16, borderWidth: 1, borderColor: '#e4e4e7' },
    statsNumber: { fontSize: 40, fontWeight: 'bold', color: '#18181b' },
    statsLabel: { fontSize: 10, fontWeight: '900', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1 },
    aiCard: { backgroundColor: '#18181b', padding: 24, borderRadius: 30, marginBottom: 32 },
    aiTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    aiSub: { color: '#a1a1aa', fontSize: 13, marginBottom: 20 },
    aiButton: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 100, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' },
    aiButtonText: { color: '#18181b', fontSize: 10, fontWeight: '900' },

    // NOWE STYLE DLA NAGŁÓWKA LISTY I FILTRA
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#18181b' },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f4f4f5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e4e4e7'
    },
    filterBtnActive: {
        backgroundColor: '#18181b',
        borderColor: '#18181b',
    },
    filterText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#71717a',
        letterSpacing: 1
    },
    filterTextActive: {
        color: '#fff'
    },

    tripCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f4f4f5',
    },
    tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    tripTitle: { fontSize: 18, fontWeight: 'bold', color: '#18181b' },
    tripRoute: { marginTop: 8, flexDirection: 'row', alignItems: 'center' },
    routeText: { color: '#71717a', fontSize: 12, maxWidth: '85%' },
    cardActions: { flexDirection: 'row', gap: 8, marginLeft: 10 },
    cardIconBtn: { padding: 4 },

    // STYLE DLA PUSTEGO STANU
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40
    },
    emptyText: {
        color: '#a1a1aa',
        fontSize: 14,
        fontWeight: '600'
    }
});