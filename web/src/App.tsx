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
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { AdminWaypointsPage } from './pages/admin/AdminWaypointsPage';
import { ErrorBoundary } from './components/common/ErrorBoundary'; // IMPORT

function App() {
    const isAuthenticated = !!localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    const userData = userRaw ? JSON.parse(userRaw) : null;
    const userRole = userData?.role || userData?.user?.role || 'user';
    const isAdmin = userRole === 'admin';

    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
                        <Route index element={<Navigate to="/dashboard" />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="dashboard/add-trip" element={<AddTripPage />} />
                        <Route path="dashboard/edit-trip/:id" element={<EditTripPage />} />
                        <Route path="dashboard/profile" element={<ProfilePage />} />
                        <Route path="trips/:id" element={<TripDetailsPage />} />

                        {/* ŚCIEŻKI ADMINISTRATORA */}
                        <Route
                            path="admin"
                            element={isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" />}
                        />
                        <Route
                            path="admin/users"
                            element={isAdmin ? <UserManagementPage /> : <Navigate to="/dashboard" />}
                        />
                        <Route
                            path="admin/waypoints"
                            element={isAdmin ? <AdminWaypointsPage /> : <Navigate to="/dashboard" />}
                        />
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default App;