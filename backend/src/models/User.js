const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Nazwa użytkownika jest wymagana'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email jest wymagany'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Proszę podać poprawny adres email']
    },
    password: {
        type: String,
        required: [true, 'Hasło jest wymagane'],
        minlength: 6,
        select: false // Hasło nie będzie domyślnie zwracane w zapytaniach GET
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

// Szyfrowanie hasła przed zapisem
UserSchema.pre('save', async function () {
    // Jeśli hasło nie zostało zmodyfikowane, przerywamy działanie funkcji
    if (!this.isModified('password')) {
        return;
    }

    // W funkcjach async w Mongoose nie używamy już parametru 'next'
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Metoda do porównywania haseł
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);