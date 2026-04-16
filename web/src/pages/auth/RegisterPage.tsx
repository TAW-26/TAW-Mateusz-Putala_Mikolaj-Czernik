import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';

export const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Hasła nie są identyczne");
        }

        try {
            // Wywołanie Twojego kontrolera authController.register
            await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            alert("Konto utworzone! Możesz się zalogować.");
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || "Błąd rejestracji");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-indigo-900 mb-8">Dołącz do Voyager AI 🌍</h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nazwa użytkownika"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Adres email"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Hasło (min. 6 znaków)"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Powtórz hasło"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required
                    />

                    <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-300">
                        Zarejestruj się
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Masz już konto? <Link to="/login" className="text-indigo-600 font-semibold">Zaloguj się</Link>
                </p>
            </div>
        </div>
    );
};