import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { AppearancePanel } from '../components/common/AppearancePanel';
import {
    Menu,
    X,
    Compass,
    LayoutDashboard,
    Plus,
    Heart,
    SlidersHorizontal,
    BarChart3,
    Users,
    MapPinned,
    LogOut,
} from 'lucide-react';

const linkBase =
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors';

function navClass({ isActive }: { isActive: boolean }) {
    return `${linkBase} ${
        isActive
            ? 'nav-link-active'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
    }`;
}

export const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userData, setUserData] = useState<Record<string, unknown> | null>(null);

    const loadUserData = () => {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
            setUserData(JSON.parse(userRaw));
        }
    };

    useEffect(() => {
        loadUserData();
        window.addEventListener('storage', loadUserData);
        window.addEventListener('userUpdate', loadUserData);
        return () => {
            window.removeEventListener('storage', loadUserData);
            window.removeEventListener('userUpdate', loadUserData);
        };
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const userRole = (userData as { role?: string; user?: { role?: string } })?.role
        || (userData as { user?: { role?: string } })?.user?.role
        || 'user';
    const isAdmin = userRole === 'admin';

    const fullUsername = (userData as { username?: string; user?: { username?: string } })?.username
        || (userData as { user?: { username?: string } })?.user?.username
        || 'Podróżnik';
    const firstName = fullUsername.split(' ')[0];

    const initials = fullUsername !== 'Podróżnik'
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

    const isFavorites = location.search.includes('filter=favorites');

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/30 dark:bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed md:static inset-y-0 left-0 z-50 w-64 glass-sidebar flex flex-col transform transition-transform duration-300 ease-in-out shadow-sm ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                <div className="h-16 px-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-sm group-hover:opacity-90 transition-opacity">
                            <Compass size={18} className="text-white dark:text-slate-900" strokeWidth={2} />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">Smart Voyager</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        aria-label="Zamknij menu"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 p-3 space-y-0.5">
                    <NavLink to="/dashboard" end className={navClass}>
                        <LayoutDashboard size={18} strokeWidth={1.75} />
                        Panel główny
                    </NavLink>
                    <NavLink to="/dashboard/add-trip" className={navClass}>
                        <Plus size={18} strokeWidth={1.75} />
                        Nowa wycieczka
                    </NavLink>
                    <NavLink
                        to="/dashboard?filter=favorites"
                        className={() =>
                            `${linkBase} ${
                                isFavorites
                                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                            }`
                        }
                    >
                        <Heart size={18} strokeWidth={1.75} />
                        Ulubione
                    </NavLink>
                    <NavLink to="/dashboard/profile" className={navClass}>
                        <SlidersHorizontal size={18} strokeWidth={1.75} />
                        Preferencje
                    </NavLink>

                    {isAdmin && (
                        <div className="pt-4 mt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-0.5">
                            <p className="px-3 py-2 text-xs font-medium text-slate-400">Administracja</p>
                            <NavLink to="/admin" end className={navClass}>
                                <BarChart3 size={18} strokeWidth={1.75} />
                                Przegląd
                            </NavLink>
                            <NavLink to="/admin/users" className={navClass}>
                                <Users size={18} strokeWidth={1.75} />
                                Użytkownicy
                            </NavLink>
                            <NavLink to="/admin/waypoints" className={navClass}>
                                <MapPinned size={18} strokeWidth={1.75} />
                                Punkty trasy
                            </NavLink>
                        </div>
                    )}
                </nav>

                <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80">
                    <button
                        onClick={handleLogout}
                        className={`${linkBase} w-full text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400`}
                    >
                        <LogOut size={18} strokeWidth={1.75} />
                        Wyloguj się
                    </button>
                </div>
            </aside>

            <main className="flex-1 min-h-screen overflow-y-auto">
                <header className="glass-header h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        aria-label="Otwórz menu"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex-1 md:flex-none" />

                    <div className="flex items-center gap-1">
                        <AppearancePanel />

                        <Link
                            to="/dashboard/user-profile"
                            className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors ml-1"
                        >
                            <div className="hidden sm:flex flex-col items-end">
                                {isAdmin && (
                                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        Admin
                                    </span>
                                )}
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {firstName}
                                </span>
                            </div>
                            <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                                {initials}
                            </div>
                        </Link>
                    </div>
                </header>

                <div className="layout-content p-4 md:p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
