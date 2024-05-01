const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    bookingDate: { type: Date, required: true },
    bookingTime: { type: String, required: true },
    movie: { type: Schema.Types.ObjectId, ref: 'Movie' },
    price: { type: Number, required: true },
    bookedSeats: { type: [String], required: true },
    timestamp: { type: Date, default: Date.now },
});

const BookingModel = mongoose.model('Booking', bookingSchema);
exports.BookingModel = BookingModel;