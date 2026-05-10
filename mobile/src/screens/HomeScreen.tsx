import React, { useEffect, useState, useCallback } from 'react'; // DODANO: useCallback
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Alert
} from 'react-native';
import { Compass, Activity, LogOut, MapPin, Plus } from 'lucide-react-native';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { useFocusEffect } from '@react-navigation/native'; // DODANO: hook do odświeżania

// Interfejs danych wycieczki
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
    const logout = useAuthStore((state) => state.logout);

    const loadTrips = async () => {
        // Przy odświeżaniu w tle nie zawsze chcemy pokazywać duży ActivityIndicator,
        // ale przy pierwszym ładowaniu jest on wskazany.
        try {
            const res = await api.get('/trips');
            const data = res.data.data || res.data || [];
            setTrips(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Błąd API:", err.response?.data || err.message);
            let errorMessage = "Nie udało się pobrać wycieczek.";
            if (err.response?.status === 401) errorMessage = "Sesja wygasła. Zaloguj się ponownie.";
            Alert.alert("Problem z połączeniem", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Automatyczne odświeżanie listy przy każdym powrocie na ekran Home
    useFocusEffect(
        useCallback(() => {
            loadTrips();
        }, [])
    );

    const handleLogout = () => {
        logout();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <View style={styles.badgeRow}>
                            <Activity size={12} color="#a1a1aa" />
                            <Text style={styles.badge}>LIVE DASHBOARD</Text>
                        </View>
                        <Text style={styles.title}>Your Journeys</Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogout}
                        style={styles.logoutBtn}
                        activeOpacity={0.7}
                    >
                        <LogOut size={22} color="#ef4444" />
                    </TouchableOpacity>
                </View>

                {/* Statystyka wycieczek */}
                <View style={styles.statsCard}>
                    <Compass size={24} color="#18181b" style={{marginBottom: 8}} />
                    <Text style={styles.statsNumber}>{loading ? '...' : trips.length}</Text>
                    <Text style={styles.statsLabel}>Total Expeditions</Text>
                </View>

                {/* Sekcja AI Prompt */}
                <View style={styles.aiCard}>
                    <Text style={styles.aiTitle}>Ready for a new discovery?</Text>
                    <Text style={styles.aiSub}>Use Llama 3.3 to generate a new itinerary.</Text>

                    <TouchableOpacity
                        style={styles.aiButton}
                        onPress={() => navigation.navigate('AddTrip')}
                    >
                        <Plus size={14} color="#18181b" style={{marginRight: 6}} />
                        <Text style={styles.aiButtonText}>GENERATE WITH AI</Text>
                    </TouchableOpacity>
                </View>

                {/* Lista Wycieczek */}
                <Text style={styles.sectionTitle}>Recent Trips</Text>
                {loading ? (
                    <View style={{ marginTop: 20 }}>
                        <ActivityIndicator color="#18181b" size="large" />
                    </View>
                ) : (
                    trips.map((trip) => (
                        <TouchableOpacity
                            key={trip._id}
                            style={styles.tripCard}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('TripDetails', { id: trip._id })} // NAWIGACJA DO SZCZEGÓŁÓW
                        >
                            <View style={styles.tripHeader}>
                                <Text style={styles.tripTitle}>{trip.title}</Text>
                                <Compass size={16} color="#e4e4e7" />
                            </View>
                            <View style={styles.tripRoute}>
                                <MapPin size={12} color="#71717a" style={{marginRight: 4}} />
                                <Text style={styles.routeText}>
                                    {trip.origin?.address || 'Unknown'} ➔ {trip.destination?.address || 'Unknown'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                {!loading && trips.length === 0 && (
                    <Text style={{ textAlign: 'center', color: '#a1a1aa', marginTop: 20 }}>
                        No trips found. Start your first mission!
                    </Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 24 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32
    },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    badge: { fontSize: 10, fontWeight: '900', color: '#a1a1aa', letterSpacing: 2 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#18181b', letterSpacing: -1 },
    logoutBtn: {
        padding: 10,
        backgroundColor: '#fef2f2',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statsCard: {
        backgroundColor: '#f4f4f5',
        padding: 24,
        borderRadius: 30,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e4e4e7'
    },
    statsNumber: { fontSize: 40, fontWeight: 'bold', color: '#18181b' },
    statsLabel: { fontSize: 10, fontWeight: '900', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1 },
    aiCard: {
        backgroundColor: '#18181b',
        padding: 24,
        borderRadius: 30,
        marginBottom: 32,
    },
    aiTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    aiSub: { color: '#a1a1aa', fontSize: 13, marginBottom: 20 },
    aiButton: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 100,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center'
    },
    aiButtonText: { color: '#18181b', fontSize: 10, fontWeight: '900' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#18181b' },
    tripCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f4f4f5',
    },
    tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    tripTitle: { fontSize: 18, fontWeight: 'bold', color: '#18181b' },
    tripRoute: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
    routeText: { color: '#71717a', fontSize: 13 },
});