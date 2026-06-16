import React from 'react';
import { MapPin, Calendar, Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TripCardProps {
    trip: {
        _id: string;
        title: string;
        origin: { address: string };
        destination: { address: string };
        startDate?: string;
        budget?: number;
    };
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
    const navigate = useNavigate();

    return (
        <div
            className="card-interactive p-5 cursor-pointer group"
            onClick={() => navigate(`/trips/${trip._id}`)}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 group-hover:bg-accent group-hover:text-white dark:group-hover:text-slate-900 transition-colors">
                    <MapPin size={18} strokeWidth={1.75} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar size={13} strokeWidth={1.75} />
                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString('pl-PL') : 'Zaplanowana'}
                </div>
            </div>

            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">{trip.title}</h3>

            <div className="mb-4">
                <p className="text-xs text-slate-400 mb-0.5">Cel podróży</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                    {trip.destination?.address || 'Brak celu'}
                </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                    <Wallet size={14} className="text-slate-400" strokeWidth={1.75} />
                    <span className="font-medium">{trip.budget || 0} PLN</span>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-accent transition-colors">
                    Zobacz <ArrowRight size={14} strokeWidth={1.75} />
                </span>
            </div>
        </div>
    );
};
