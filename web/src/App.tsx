import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AddTripPage } from './pages/dashboard/AddTripPage';
import { EditTripPage } from './pages/dashboard/EditTripPage';
import { TripDetailsPage } from './pages/dashboard/TripDetailsPage.tsx';
import { ProfilePage } from './pages/ProfilePage';
import { MainLayout } from './layouts/MainLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    // --- POPRAWKA POBIERANIA ROLI ---
    const userRaw = localStorage.getItem('user');
    const userData = userRaw ? JSON.parse(userRaw) : null;

    // Sprawdzamy rolę w obiekcie (obsługujemy różne struktury: userData.role lub userData.user.role)
    const userRole = userData?.role || userData?.user?.role || 'user';
    const isAdmin = userRole === 'admin';
    // --------------------------------

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Główny wrapper dla zalogowanych */}
                <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
                    <Route index element={<Navigate to="/dashboard" />} />

                    {/* Ścieżki użytkownika */}
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="dashboard/add-trip" element={<AddTripPage />} />
                    <Route path="dashboard/edit-trip/:id" element={<EditTripPage />} />
                    <Route path="dashboard/profile" element={<ProfilePage />} />
                    <Route path="trips/:id" element={<TripDetailsPage />} />

                    {/* Ścieżka admina - teraz isAdmin będzie miało poprawną wartość */}
                    <Route
                        path="admin"
                        element={isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" />}
                    />
                </Route>

                {/* Catch-all przekierowujący do dashboardu */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;