import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
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
                    <Link to="/add-trip" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition">
                        <span className="mr-3">✨</span> Nowa Wycieczka
                    </Link>
                    <Link to="/profile" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition">
                        <span className="mr-3">👤</span> Profil i Preferencje
                    </Link>

                    {/* Sekcja Admina - widoczna tylko jeśli rola to admin */}
                    <div className="pt-4 mt-4 border-t border-indigo-800">
                        <p className="px-3 text-xs uppercase text-indigo-400 font-semibold mb-2">Administracja</p>
                        <Link to="/admin/stats" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition">
                            <span className="mr-3">🛡️</span> Statystyki Systemu
                        </Link>
                    </div>
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
                <header className="bg-white h-16 shadow-sm flex items-center justify-end px-8">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">Witaj, Mateusz!</span>
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                            MP
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {/* Tu React Router wstrzyknie treść konkretnej strony */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};