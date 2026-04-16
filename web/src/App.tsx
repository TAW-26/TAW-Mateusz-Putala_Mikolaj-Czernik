// src/App.tsx
import { DashboardPage } from './pages/dashboard/DashboardPage';

function App() {
    // W przyszłości tutaj dodamy React Router do nawigacji między stronami
    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardPage />
        </div>
    );
}

export default App;