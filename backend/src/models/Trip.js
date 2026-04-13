const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Tytuł wycieczki jest wymagany'],
        trim: true
    },
    destination: {
        type: String,
        required: [true, 'Cel podróży jest wymagany']
    },
    startDate: { type: Date },
    endDate: { type: Date },
    budget: {
        type: Number,
        default: 0,
        min: [0, 'Budżet nie może być ujemny']
    },
    description: { type: String },
    status: {
        type: String,
        enum: ['planowana', 'w trakcie', 'zakończona'],
        default: 'planowana'
    }
}, {
    timestamps: true,
    // To jest kluczowe, aby wirtualne pola pojawiały się w odpowiedziach JSON i obiektach
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Wirtualne pole obliczające czas trwania wycieczki w dniach
tripSchema.virtual('duration').get(function() {
    if (this.startDate && this.endDate) {
        const diffInMs = Math.abs(this.endDate - this.startDate);
        return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    }
    return 0;
});

module.exports = mongoose.model('Trip', tripSchema);