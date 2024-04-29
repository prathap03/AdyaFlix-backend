const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    timestamp: { type: Date, default: Date.now },
});

const UserModel = mongoose.model('User', userSchema);
exports.exports = UserModel;
