import React, { useState } from 'react';
import api from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token); // Zapisujemy JWT
            navigate('/dashboard'); // Przekierowanie
            window.location.reload(); // Odświeżenie stanu auth
        } catch (error) {
            alert('Nie udało się zalogować. Sprawdź dane (admin@voyager.com / admin123)');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
            <form onSubmit={handleLogin} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <h2>Logowanie Smart Voyager ✈️</h2>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ display: 'block', marginBottom: '10px', width: '250px' }} />
                <input type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} required style={{ display: 'block', marginBottom: '10px', width: '250px' }} />
                <button type="submit" style={{ width: '100%', cursor: 'pointer' }}>Zaloguj się</button>
            </form>
        </div>
    );
};