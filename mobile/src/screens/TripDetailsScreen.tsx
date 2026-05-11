import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    StyleSheet, Text, View, ScrollView, TouchableOpacity,
    ActivityIndicator, SafeAreaView, Alert, LayoutAnimation, Platform, UIManager
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
    ChevronLeft, Sparkles, MapPin, Navigation,
    Trash2, CheckCircle2, Clock, ShieldCheck
} from 'lucide-react-native';
import { tripsService } from '../api/tripsService';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TripDetailsScreen({ route, navigation }: any) {
    const { id } = route.params;
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const mapRef = useRef<MapView>(null);

    const loadData = useCallback(async () => {
        try {
            const res = await tripsService.getTripDetails(id);
            const data = res.data || res;
            setTrip(data);
        } catch (err: any) {
            Alert.alert("System Failure", "Could not sync with Voyager DB.");
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    }, [id, navigation]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleWaypointPress = (wp: any) => {
        const lat = wp.location?.lat || wp.lat;
        const lng = wp.location?.lng || wp.lng;
        if (mapRef.current && lat && lng) {
            mapRef.current.animateToRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };

    const toggleDescription = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    const handleGenerateAI = async () => {
        setIsGenerating(true);
        try {
            await tripsService.generateAIWaypoints(id);
            await loadData();
            Alert.alert("Mission Updated", "AI has plotted new trajectory.");
        } catch (err: any) {
            Alert.alert("AI Error", err.message);
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
                    w._id === wp._id ? { ...w, visited: newStatus } : w
                )
            }));
        } catch (err: any) {
            Alert.alert("Sync Error", "Could not update point status.");
        }
    };

    const deleteWaypoint = (wpId: string) => {
        Alert.alert("Abort Objective?", "Remove this point from navigation?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await tripsService.deleteWaypoint(wpId);
                        setTrip((prev: any) => ({
                            ...prev,
                            waypoints: prev.waypoints.filter((w: any) => w._id !== wpId)
                        }));
                    } catch (err) { Alert.alert("Error", "Delete failed."); }
                }
            }
        ]);
    };

    if (loading || !trip) return (
        <View style={styles.centered}><ActivityIndicator color="#18181b" size="large" /></View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft color="#18181b" size={24} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <View style={styles.missionBadge}>
                        <ShieldCheck size={10} color="#a855f7" />
                        <Text style={styles.missionText}>ACTIVE MISSION</Text>
                    </View>
                    <Text style={styles.title} numberOfLines={1}>{trip.title}</Text>
                </View>
                <TouchableOpacity
                    onPress={handleGenerateAI}
                    disabled={isGenerating}
                    style={[styles.aiBtn, isGenerating && { opacity: 0.5 }]}
                >
                    {isGenerating ? <ActivityIndicator size="small" color="#fff" /> : <Sparkles size={20} color="#fff" />}
                </TouchableOpacity>
            </View>

            {/* Kluczowe: contentContainerStyle z flexGrow: 1 */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: trip.waypoints?.[0]?.lat || 52.2297,
                            longitude: trip.waypoints?.[0]?.lng || 21.0122,
                            latitudeDelta: 0.5,
                            longitudeDelta: 0.5,
                        }}
                    >
                        {trip.waypoints?.map((wp: any, idx: number) => (
                            <Marker
                                key={wp._id || idx}
                                coordinate={{
                                    latitude: wp.location?.lat || wp.lat,
                                    longitude: wp.location?.lng || wp.lng
                                }}
                                title={wp.name}
                                pinColor={idx === 0 ? "gold" : (idx === trip.waypoints.length - 1 ? "red" : "violet")}
                            />
                        ))}
                    </MapView>
                </View>

                <View style={styles.content}>
                    <View style={styles.sectionHeader}>
                        <Clock size={14} color="#71717a" />
                        <Text style={styles.sectionTitle}>INTELLIGENCE DIRECTIVES</Text>
                    </View>

                    {trip.waypoints?.map((wp: any, index: number) => {
                        const isExpanded = expandedId === wp._id;

                        return (
                            <TouchableOpacity
                                key={wp._id || index}
                                style={[styles.wpCard, wp.visited && styles.wpVisited]}
                                onPress={() => handleWaypointPress(wp)}
                                onLongPress={() => toggleDescription(wp._id)}
                                delayLongPress={350}
                                activeOpacity={0.8}
                            >
                                <View style={styles.wpNumberContainer}>
                                    <TouchableOpacity
                                        onPress={() => toggleVisited(wp)}
                                        style={[styles.checkCircle, wp.visited && styles.checkActive]}
                                    >
                                        {wp.visited ? <CheckCircle2 size={16} color="#fff" /> : <Text style={styles.wpIndex}>{index + 1}</Text>}
                                    </TouchableOpacity>
                                    {index !== trip.waypoints.length - 1 && <View style={styles.line} />}
                                </View>

                                <View style={styles.wpContent}>
                                    <View style={styles.wpHeader}>
                                        <Text style={[styles.wpName, wp.visited && styles.textStrikethrough]}>{wp.name}</Text>
                                        <TouchableOpacity onPress={() => deleteWaypoint(wp._id)} style={styles.deleteBtn}>
                                            <Trash2 size={16} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.wpAddress}>{wp.address || "Location Verified"}</Text>

                                    {/* SEKCJA OPISU - KOMPLETNIE PRZEBUDOWANA DLA PEWNOŚCI WYŚWIETLANIA */}
                                    <View style={styles.descriptionContainer}>
                                        {isExpanded ? (
                                            <View style={styles.expandedBox}>
                                                <Text
                                                    key={`full-${wp._id}`}
                                                    style={styles.wpDescFull}
                                                >
                                                    {wp.description ? wp.description.trim() : "No description available."}
                                                </Text>
                                                <Text style={styles.expandHint}>Hold to collapse</Text>
                                            </View>
                                        ) : (
                                            <Text
                                                key={`short-${wp._id}`}
                                                style={styles.wpDescShort}
                                                numberOfLines={2}
                                            >
                                                {wp.description ? wp.description.trim() : "No description available."}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={{ height: 60 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
    backBtn: { padding: 8, backgroundColor: '#f4f4f5', borderRadius: 12 },
    headerInfo: { flex: 1, marginLeft: 16 },
    missionBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
    missionText: { fontSize: 8, fontWeight: '900', color: '#a855f7', letterSpacing: 1 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#18181b' },
    aiBtn: { backgroundColor: '#18181b', padding: 10, borderRadius: 12 },
    mapContainer: { height: 300, width: '100%', backgroundColor: '#f4f4f5' },
    map: { flex: 1 },
    content: { padding: 24 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
    sectionTitle: { fontSize: 10, fontWeight: '900', color: '#71717a', letterSpacing: 2 },
    wpCard: { flexDirection: 'row', marginBottom: 12 }, // Usunięto minHeight
    wpVisited: { opacity: 0.6 },
    wpNumberContainer: { alignItems: 'center', width: 40 },
    checkCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f4f4f5', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e4e4e7' },
    checkActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
    wpIndex: { fontSize: 12, fontWeight: 'bold', color: '#71717a' },
    line: { width: 2, flex: 1, backgroundColor: '#f4f4f5', marginVertical: 4 },
    wpContent: { flex: 1, marginLeft: 12 },
    wpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    wpName: { fontSize: 16, fontWeight: 'bold', color: '#18181b', flex: 1 },
    deleteBtn: { padding: 4 },
    textStrikethrough: { textDecorationLine: 'line-through', color: '#a1a1aa' },
    wpAddress: { fontSize: 10, fontWeight: 'bold', color: '#a855f7', textTransform: 'uppercase', marginBottom: 4 },

    descriptionContainer: { marginTop: 2 },
    wpDescShort: { fontSize: 13, color: '#71717a', lineHeight: 18 },
    wpDescFull: { fontSize: 13, color: '#3f3f46', lineHeight: 20 },
    expandedBox: {
        backgroundColor: '#fdfaff',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#a855f7',
        marginTop: 6
    },
    expandHint: { fontSize: 10, color: '#a855f7', marginTop: 10, fontStyle: 'italic', fontWeight: 'bold' }
});