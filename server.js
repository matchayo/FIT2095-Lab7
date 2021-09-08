const express = require("express");
const mongoose = require("mongoose");

const actors = require("./routers/actor");
const movies = require("./routers/movie");

const app = express();

app.listen(8080);

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/FIT2095_Lab7", function (err) {
    if (err) {
        return console.log("Mongoose - connection error:", err);
    }
    console.log("Connect Successfully");
});

// Extra task
app.put('/actors/e/inc', actors.updateBirthYear);

app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movies', actors.addMovie);

app.delete('/actors/:id', actors.deleteOne);
app.delete('/actors/:id/movies', actors.deleteOneWithMovies);
app.delete('/actors/:aId/:mId', actors.deleteMovieFromActor);

app.get('/movies/betweenYear', movies.findBetweenYear);
app.delete('/movies/betweenYear', movies.deleteBetweenYear);

app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);
app.delete('/movies/:id', movies.deleteOne);

app.delete('/movies/:mId/:aId', movies.deleteActorFromMovie);
app.post('/movies/:id/actors', movies.addActor);