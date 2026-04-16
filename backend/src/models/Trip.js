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
    // PUNKT A: Start
    origin: {
        address: { type: String, default: 'Obecna lokalizacja' },
        lat: { type: Number },
        lng: { type: Number }
    },
    // PUNKT B: Cel
    destination: {
        address: { type: String, required: [true, 'Cel podróży jest wymagany'] },
        lat: { type: Number },
        lng: { type: Number }
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
    },
    aiSettings: {
        intensity: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        },
        extraTimeTolerance: {
            type: Number,
            min: 0,
            max: 100,
            default: 20
        },
        numberOfPoints: {
            type: Number,
            min: 1,
            max: 10,
            default: 5
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Czas trwania
tripSchema.virtual('duration').get(function() {
    if (this.startDate && this.endDate) {
        const diffInMs = Math.abs(this.endDate - this.startDate);
        return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    }
    return 0;
});

// Relacja z punktami trasy
tripSchema.virtual('waypoints', {
    ref: 'Waypoint',
    localField: '_id',
    foreignField: 'trip'
});

module.exports = mongoose.model('Trip', tripSchema);


