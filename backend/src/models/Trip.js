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
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);