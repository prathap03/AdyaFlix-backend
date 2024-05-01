const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/authMiddleware');
const AdminVerifyToken = require('../utils/AdminAuthMiddleware');
const MovieModel = require('../models/MovieModel').MovieModel;
const ShowTimeModel = require('../models/ShowTimeModel').ShowTimeModel;



// Protected route
router.get('/', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
});

//add movie
router.post('/addMovie', async(req, res) => {
    try {
        const {title, description, genre, rating, languages,duration,price,poster,gif,showTimes,bookings} = req.body;
        const movie = new MovieModel({ 
            title, 
            description, 
            genre, 
            rating, 
            languages, 
            duration, 
            price, 
            poster, 
            gif, 
            showTimes, 
            bookings
        })
        await movie.save()
        res.status(200).json({ message: 'Movie added successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server error' });
    }   
}
);

//get all movies
router.get('/getMovies', async(req, res) => {
    try {
        const movies = await MovieModel.find();
        res.status(200).json(movies);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server error' });
    }
})

router.get('/getMovies/:id', async(req, res) => {
    try {
        const movies = await MovieModel.findById(req.params.id);
        res.status(200).json(movies);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server error' });
    }
})
const mongoose = require('mongoose');
router.get('/getMovies/:id/shows', async(req, res) => {
    try {
        const movieId = new mongoose.Types.ObjectId(req.params.id);
        
        const movies = await ShowTimeModel.find({movieId:movieId});
        res.status(200).json(movies);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server error' });
    }
})

router.get('/getMovies/:id/shows/:day/:time', async(req, res) => {
    try {
        const dayId = new mongoose.Types.ObjectId(req.params.day);
        const movieId = new mongoose.Types.ObjectId(req.params.id);

        const movie = await MovieModel.findById(movieId);
        
        const movies = await ShowTimeModel.find({_id:dayId});
        
        //return only the seat matrix of the said time
        const seats = movies[0].shows
        .filter(show => show.time === req.params.time)
        .map(show => show.seats);
        console.log(seats)
        res.status(200).json({
            movie: movie,
            seats: seats,
            time: req.params.time
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server error' });
    }
})




//delete movie
router.delete('/deleteMovie', AdminVerifyToken, async(req, res) => {
    try {
        const {movieName} = req.body;
        const movie = await MovieModel.findOne({name:movieName});
        if(movie === null){
            return res.status(404).json({error: 'Movie not found'});
        }
        await movie.delete();
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

//update movie
router.put('/updateMovie', AdminVerifyToken, async(req, res) => {
    try {
        const {movieName, price, availableSeats, showTime} = req.body;
        const movie = await MovieModel.findOne({name:movieName});
        if(movie === null){
            return res.status(404).json({error: 'Movie not found'});
        }
        movie.price = price;
        movie.availableSeats = availableSeats;
        movie.showTime = showTime;
        await movie.save();
        res.status(200).json({ message: 'Movie updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

//update seat
router.put('/updateSeat', async(req, res) => {
    try {
        const {movieName, seat} = req.body;
        const movie = await MovieModel.findOne({name:movieName});
        if(movie === null){
            return res.status(404).json({error: 'Movie not found'});
        }
        movie.availableSeats = movie.availableSeats.filter((availableSeat) => availableSeat !== seat);
        await movie.save();
        res.status(200).json({ message: 'Seat updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

module.exports = router;
