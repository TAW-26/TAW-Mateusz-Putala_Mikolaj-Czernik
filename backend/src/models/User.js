const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' } // Domyślnie zwykły użytkownik
}, { timestamps: true });

// Szyfrowanie hasła przed zapisem do bazy
userSchema.pre('save', async function () {
    const user = this;

    // Jeśli hasło nie zostało zmienione, po prostu wyjdź z funkcji
    if (!user.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    } catch (err) {
        throw new Error(err); // Rzucenie błędu zatrzyma zapis
    }
});

module.exports = mongoose.model('User', userSchema);