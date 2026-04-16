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
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // --- NOWA SEKCJA PREFERENCJI DLA AI ---
    preferences: {
        interests: {
            type: [String],
            enum: [
                'architektura_zabytkowa', 'architektura_nowoczesna',
                'muzea_sztuki', 'muzea_techniki', 'historia_wojenna',
                'parki_narodowe', 'góry', 'jeziora_i_rzeki',
                'punkty_widokowe', 'fotografia',
                'kuchnia_lokalna', 'street_food', 'kawiarnie',
                'winiarnie_browary', 'opcje_wege'
            ],
            default: []
        },
        travelStyle: {
            avoidPaidAttractions: { type: Boolean, default: false },
            onlyHiddenGems: { type: Boolean, default: false },
            kidFriendly: { type: Boolean, default: false },
            disabilityAccess: { type: Boolean, default: false },
            preferWalking: { type: Boolean, default: false }
        },
        personalNotes: {
            type: String,
            maxlength: 500,
            default: ""
        }
    }
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);


