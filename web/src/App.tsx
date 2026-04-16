import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage'; // Import rejestracji z Twojej struktury
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AddTripPage } from './pages/dashboard/AddTripPage'; // Poprawiona ścieżka do folderu dashboard
import { ProfilePage } from './pages/ProfilePage'; // Zakładając, że tu go umieścisz
import { MainLayout } from './layouts/MainLayout';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                {/* TRASY PUBLICZNE */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* TRASY CHRONIONE (OWINIĘTE W LAYOUT) */}
                <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/add-trip" element={<AddTripPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    {/* Dodaj tutaj trasę dla szczegółów wycieczki, gdy będzie gotowa */}
                </Route>

                {/* PRZEKIEROWANIE STARTOWE */}
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;