const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    poster: { type: String, required: true },
    showtimes: { type: [String], required: true },
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    availableSeats: { type: [String], required: true },
    timestamp: { type: Date, default: Date.now },
});

const MovieModel = mongoose.model('Movie', movieSchema);
exports.exports = MovieModel;