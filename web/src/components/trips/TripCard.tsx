import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TripCardProps {
    trip: {
        _id: string;
        title: string;
        // Zmienione na obiekty zgodnie z modelem backendu
        origin: { address: string };
        destination: { address: string };
        startDate?: string;
        budget?: number;
    };
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border border-zinc-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all cursor-pointer group"
            onClick={() => navigate(`/trips/${trip._id}`)}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-zinc-50 rounded-2xl group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <MapPin size={20} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <Calendar size={12} />
                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Planned'}
                </div>
            </div>

            <h3 className="text-lg font-bold tracking-tight text-zinc-900 mb-1">{trip.title}</h3>

            {/* Poprawka: Dodano .address, aby wyświetlić tekst zamiast obiektu */}
            <div className="mb-6">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Destination</p>
                <p className="text-sm text-zinc-500">{trip.destination?.address || 'No destination address'}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                <div className="flex items-center gap-2">
                    <Wallet size={14} className="text-zinc-300" />
                    <span className="text-xs font-bold text-zinc-600">{trip.budget || 0} PLN</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-black uppercase tracking-tighter text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity">
                    Details <ArrowRight size={14} />
                </div>
            </div>
        </motion.div>
    );
};