const mongoose = require("mongoose");

const Actor = require("../models/actor");
const Movie = require("../models/movie");

module.exports = {
    getAll: function (req, res) {
        Movie.find({})
        .populate('actors')
        .exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
    
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },

    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },

    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },

    deleteOne: function (req, res) {
        Movie.findOneAndRemove({_id: req.params.id}, function (err) {
            if (err) return res.status(400).json(err);
            res.json("Deleted");
        });
    },

    deleteActorFromMovie: function (req, res) {
        
        Movie.findOne({_id: req.params.mId}, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findOne({_id: req.params.aId}, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                var index = -1;
                for (let i = 0; i < movie.actors.length; i++) {
                        let currentActor = new mongoose.Types.ObjectId(movie.actors[i]);
                    if (currentActor == req.params.aId) {
                        index = i;
                    }
                }

                if (index === -1) return res.status(404).json()
                    
                movie.actors.splice(index, 1);

                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            });
        });
    },

    addActor: function (req, res) {
        Movie.findOne({_id: req.params.id}, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findOne({_id: req.body.id}, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            });
        });
    },

    findBetweenYear: function (req, res) {
        let year1 = req.body.year1;
        let year2 = req.body.year2;

        if (year1 <= year2) return res.json("year1 should be greater than year2");
        Movie.where('year').gte(year2).lte(year1).exec(function (err, docs) {
            res.json(docs);
        });
    },

    deleteBetweenYear: function (req, res) {
        let year1 = req.body.year1;
        let year2 = req.body.year2;

        if (year1 <= year2) return res.json("year1 should be greater than year2");
        Movie.deleteMany().where('year').gte(year2).lte(year1).exec(function (err, docs) {
            if (err) return res.status(400).json(err);
            if (!docs) return res.status(404).json();
                res.json("Deleted");
        });
    }
};