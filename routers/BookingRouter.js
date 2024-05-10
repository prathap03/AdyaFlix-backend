const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/authMiddleware");

const User = require("../models/UserModel").UserModel;
const Movie = require("../models/MovieModel").MovieModel;
const BookingModel = require("../models/BookingModel").BookingModel;

// Protected route
router.get("/", verifyToken, (req, res) => {
  res.status(200).json({ message: "Protected route accessed" });
});

const jswt = require("jsonwebtoken");
const { ShowTimeModel } = require("../models/ShowTimeModel");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//movie booking
router.post("/bookMovie", verifyToken, async (req, res) => {
  try {
    const { movieId, bookingTime, noOfTickets, bookedSeats, price,showId } = req.body;
    const decoded = jswt.verify(req.body.token, process.env.JWT_SECRET);
    const user = await User.findOne({ username: decoded.user.username });
    console.log(decoded);
    console.log(req.body);
    if (user === null) {
      return res.status(404).json({ error: "User not found" });
    }
    const movie = await Movie.findOne({ _id: movieId });
    const booking = new BookingModel({
      userId: user._id,
      bookingDate: new Date(),
      bookingTime: bookingTime,
      movie: movie._id,
      price: price,
      noOfTickets: noOfTickets,
      bookedSeats: bookedSeats,
    });
    await booking.save();
    const filter = { _id: showId };
    const update = { $set: { "shows.$[elem].seats": bookedSeats } };
    //push the seats into the arry

    
    const options = { arrayFilters: [{ "elem.time": bookingTime }] };

    const show = await ShowTimeModel.findOne({_id: showId});
    console.log(show)
    show.shows.map((s)=>{
      console.log(s.time,bookingTime,s.time == bookingTime)
      if(s.time == bookingTime){
        s.seats=[...s.seats,...bookedSeats]
        console.log(s.seats,"--->SEATS")
      }
    })
    show.markModified('shows');
    await show.save()
    console.log(show)
    user.bookings.push(booking._id);
    user.save();
    res
      .status(200)
      .json({ message: "Movie booking successful", id: booking._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  const regex = new RegExp(query, "i");
  const movies = await Movie.find({ title: regex });
  if (movies.length === 0) {
    return res.status(404).json({ error: "No movies found" });
  }

  res.status(200).json(movies);
});

router.get("/getBookings", verifyToken, async (req, res) => {
  try {
    const decoded = jswt.verify(
      req.header("Authorization"),
      process.env.JWT_SECRET
    );

    const user = await User.findOne({
      username: decoded.user.username,
    }).populate({
      path: "bookings",
      populate: { path: "movie" }, // Populate the 'movie' field of each booking
    });
    if (user === null) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/deleteBooking", verifyToken, async (req, res) => {
  try {
    const { username, bookingId } = req.body;
    const user = await User.findOne({ username: username }).populate(
      "bookings"
    );
    if (user === null) {
      return res.status(404).json({ error: "User not found" });
    }
    const booking = await BookingModel.findOne({ _id: bookingId });
    if (booking === null) {
      return res.status(404).json({ error: "Booking not found" });
    }
    await BookingModel.deleteOne({ _id: bookingId });
    user.bookings = user.bookings.filter(
      (booking) => booking._id !== bookingId
    );
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/updateBooking", verifyToken, async (req, res) => {
  try {
    const { username, bookingId, newShowTime, newSeatsChoosen } = req.body;
    const user = await User.findOne({ username: username }).populate(
      "bookings"
    );
    if (user === null) {
      return res.status(404).json({ error: "User not found" });
    }
    const booking = await BookingModel.findOne({ _id: bookingId });
    if (booking === null) {
      return res.status(404).json({ error: "Booking not found" });
    }
    booking.bookingTime = newShowTime;
    booking.bookedSeats = newSeatsChoosen;
    await booking.save();
    res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/getBookingDetails/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.findOne({ _id: id }).populate("movie");
    if (booking === null) {
      return res.status(404).json({ error: "Booking not found" });
    }
    console.log(booking);
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
