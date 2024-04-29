const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/authMiddleware');
const AdminVerifyToken = require('../utils/AdminAuthMiddleware');
const MovieModel = require('../models/MovieModel');



// Protected route
router.get('/', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
});

//add movie
router.post('/addMovie', AdminVerifyToken, async(req, res) => {
    try {
        const {movieName, price, availableSeats, showTime} = req.body;
        const movie = new MovieModel({ 
            name: movieName,
            price: price,
            availableSeats: availableSeats,
            showTime: showTime
        })
        await movie.save()
        res.status(200).json({ message: 'Movie added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }   
}
);

//get all movies
router.get('/getMovies', AdminVerifyToken, async(req, res) => {
    try {
        const movies = await MovieModel.find();
        res.status(200).json(movies);
    } catch (error) {
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
router.put('/updateSeat', verifyToken, async(req, res) => {
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
