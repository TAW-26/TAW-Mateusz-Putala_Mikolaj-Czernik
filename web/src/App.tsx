import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AddTripPage } from './pages/dashboard/AddTripPage';
// POPRAWKA IMPORTÓW: Pliki są w folderze dashboard
import { TripDetailsPage } from './pages/TripDetailsPage';
import { ProfilePage } from './pages/ProfilePage';
import { MainLayout } from './layouts/MainLayout';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* GŁÓWNA ZMIANA: Używamy "/" jako bazy dla Layoutu, aby obsłużyć obie ścieżki */}
                <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
                    <Route index element={<Navigate to="/dashboard" />} />

                    {/* Ścieżki zaczynające się od /dashboard */}
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="dashboard/add-trip" element={<AddTripPage />} />
                    <Route path="dashboard/profile" element={<ProfilePage />} />

                    {/* Ścieżka, której szuka Twoja przeglądarka na zdjęciu */}
                    <Route path="trips/:id" element={<TripDetailsPage />} />
                </Route>

                {/* Catch-all przekierowujący do dashboardu */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;