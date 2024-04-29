const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/authMiddleware');

const User = require('../models/UserModel');
const Movie = require("../models/MovieModel");

// Protected route
router.get('/', verifyToken, (req, res) => {
res.status(200).json({ message: 'Protected route accessed' });
});

//movie booking
router.post('/bookMovie', verifyToken, async(req, res) => {
    try {
        const {username, movieName, showTime, noOfTickets, seatsChoosen} = req.body;
        const user = await User.findOne({username:username})
        if(user === null){
            return res.status(404).json({error: 'User not found'});
        }
        const movie = await Movie.findOne({name:movieName});
        const booking = new BookingModel({ 
            username: user._id,
            bookingDate: new Date(),
            bookingTime: showTime,
            bookingType: 'Movie',
            movie: movie._id,
            price: movie.price * noOfTickets,
            bookedSeats: seatsChoosen
        })
        await booking.save();
        user.bookings.push(booking._id);
        res.status(200).json({ message: 'Movie booking successful' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get("/getBookings", verifyToken, async(req, res) => {
    try {
        const {username} = req.body;
        const user = await User.findOne({username:username}).populate('bookings');
        if(user === null){
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json(user.bookings);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

router.delete("/deleteBooking", verifyToken, async(req, res) => {
    try {
        const {username, bookingId} = req.body;
        const user = await User.findOne({username:username}).populate('bookings');
        if(user === null){
            return res.status(404).json({error: 'User not found'});
        }
        const booking = await BookingModel.findOne({_id:bookingId});
        if(booking === null){
            return res.status(404).json({error: 'Booking not found'});
        }
        await BookingModel.deleteOne({_id:bookingId});
        user.bookings = user.bookings.filter((booking) => booking._id !== bookingId);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

router.put("/updateBooking", verifyToken, async(req, res) => {
    try {
        const {username, bookingId, newShowTime, newSeatsChoosen} = req.body;
        const user = await User
        .findOne({username:username})
        .populate('bookings');
        if(user === null){
            return res.status(404).json({error: 'User not found'});
        }
        const booking = await BookingModel.findOne({_id:bookingId});
        if(booking === null){
            return res.status(404).json({error: 'Booking not found'});
        }
        booking.bookingTime = newShowTime;
        booking.bookedSeats = newSeatsChoosen;
        await booking.save();
        res.status(200).json({ message: 'Booking updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

router.get("/getBookingDetails", verifyToken, async(req, res) => {
    try {
        const {bookingId} = req.body;
        const booking = await BookingModel.findOne({_id:bookingId}).populate('movie');
        if(booking === null){
            return res.status(404).json({error: 'Booking not found'});
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})


module.exports = router;