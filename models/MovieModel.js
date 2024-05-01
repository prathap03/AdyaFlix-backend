const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: {type:[String],required:true},
    rating:{ type: String, required: true },
    languages:{type:[String],required:true},
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    poster: { type: String, required: true },
    gif: { type: String, required: true },
    showtimes: { type: [String], required: true },
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    timestamp: { type: Date, default: Date.now },
});

const MovieModel = mongoose.model('Movie', movieSchema);
exports.MovieModel = MovieModel;