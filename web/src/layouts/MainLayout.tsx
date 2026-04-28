import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
    const navigate = useNavigate();

    const userRaw = localStorage.getItem('user');
    const userData = userRaw ? JSON.parse(userRaw) : null;

    const userRole = userData?.role || userData?.user?.role || 'user';
    const isAdmin = userRole === 'admin';

    const fullUsername = userData?.username || userData?.user?.username || 'Podróżniku';
    const firstName = fullUsername.split(' ')[0];

    const initials = fullUsername !== 'Podróżniku'
        ? fullUsername
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
        : '??';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* SIDEBAR */}
            <aside className="w-64 bg-indigo-900 text-white flex flex-col shadow-xl">
                <div className="p-6 text-2xl font-bold border-b border-indigo-800 flex items-center gap-2">
                    🌍 <span>Voyager AI</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/dashboard" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition">
                        <span className="mr-3">📊</span> Dashboard
                    </Link>
                    <Link to="/dashboard/add-trip" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition">
                        <span className="mr-3">✨</span> Nowa Wycieczka
                    </Link>

                    <Link
                        to="/dashboard?filter=favorites"
                        className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition text-rose-300 font-medium"
                    >
                        <span className="mr-3">❤️</span> Ulubione
                    </Link>

                    {/* PREFERENCJE - zostają bez zmian */}
                    <Link to="/dashboard/profile" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition">
                        <span className="mr-3">👤</span> Preferencje
                    </Link>

                    {isAdmin && (
                        <div className="pt-4 mt-4 border-t border-indigo-800 animate-in fade-in duration-500 space-y-1">
                            <p className="px-3 text-[10px] uppercase text-indigo-400 font-black mb-2 tracking-[0.2em]">Command Center</p>
                            <Link to="/admin" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition text-white">
                                <span className="mr-3 text-sm">🛡️</span> Statystyki Systemu
                            </Link>
                            <Link to="/admin/users" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition text-white font-medium">
                                <span className="mr-3 text-sm">👥</span> Rejestr Agentów
                            </Link>
                            <Link to="/admin/waypoints" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition text-amber-400 font-medium">
                                <span className="mr-3 text-sm">📍</span> Baza Waypointów
                            </Link>
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-indigo-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-3 text-red-300 hover:bg-red-900/30 rounded-lg transition"
                    >
                        <span className="mr-3">🚪</span> Wyloguj
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 h-screen overflow-y-auto">
                <header className="bg-white h-16 shadow-sm flex items-center justify-end px-8 sticky top-0 z-10">
                    {/* KLIKALNY PROFIL UŻYTKOWNIKA - teraz prowadzi do /dashboard/user-profile */}
                    <Link
                        to="/dashboard/user-profile"
                        className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-xl transition-all group"
                    >
                        <div className="flex flex-col items-end">
                            {isAdmin && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded uppercase border border-red-200">
                                    Admin Mode
                                </span>
                            )}
                            <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">
                                Witaj, {firstName}!
                            </span>
                        </div>
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 group-hover:scale-105 group-hover:border-indigo-400 transition-all shadow-sm">
                            {initials}
                        </div>
                    </Link>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};