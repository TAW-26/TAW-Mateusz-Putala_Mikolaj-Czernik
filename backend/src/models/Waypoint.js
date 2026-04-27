const mongoose = require('mongoose');

const waypointSchema = new mongoose.Schema({
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    name: { type: String, required: true },
    // DODAJEMY TO POLE:
    address: { type: String },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    description: { type: String },
    order_index: { type: Number, default: 0 },
    visited: { type: Boolean, default: false }
});

module.exports = mongoose.model('Waypoint', waypointSchema);