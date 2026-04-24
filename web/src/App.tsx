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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Zmieniamy ścieżkę bazową na /dashboard */}
                <Route path="/dashboard" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
                    {/* path="" oznacza główną stronę dashboardu (localhost:5173/dashboard) */}
                    <Route index element={<DashboardPage />} />

                    {/* path="add-trip" sprawia, że adres to: localhost:5173/dashboard/add-trip */}
                    <Route path="add-trip" element={<AddTripPage />} />

                    {/* path="profile" sprawia, że adres to: localhost:5173/dashboard/profile */}
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;