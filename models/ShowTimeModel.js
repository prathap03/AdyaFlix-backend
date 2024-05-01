const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const showTImeSchema = new Schema({
    date: { type: Date, required: true },
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie' },
    shows: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now },
});

const ShowTimeModel = mongoose.model('Showtime', showTImeSchema);
exports.ShowTimeModel = ShowTimeModel;