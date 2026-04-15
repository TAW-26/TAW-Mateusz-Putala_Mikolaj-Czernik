const mongoose = require('mongoose');

const waypointSchema = new mongoose.Schema({
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    name: { type: String, required: true },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    description: { type: String },
    order_index: { type: Number, default: 0 }, // Kolejność zwiedzania
    visited: { type: Boolean, default: false }
});

module.exports = mongoose.model('Waypoint', waypointSchema);