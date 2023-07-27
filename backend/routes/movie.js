const express = require('express');
const { uploadTrailer, createMovie, updateMovie, removeMovie, getMovies, getMovieForUpdate, searchMovies, getLatestUploads, getSingleMovie, getRelatedMovies, getTopRatedMovies, searchPublicMovies } = require('../controllers/movie');
const { isAdmin, isAuth } = require('../milddlewares/auth');
const { uploadVideo, uploadImage } = require('../milddlewares/mutler');
const { validateMovie, validate, ValidateTrailer } = require('../milddlewares/validator');
const { parseData } = require('../utils/helper');
const router = express.Router();

router.post('/upload-trailer',isAuth,isAdmin,uploadVideo.single('video'),uploadTrailer);
router.post('/create',
isAuth,isAdmin,uploadImage.single('poster'),parseData,
validateMovie,ValidateTrailer,validate,
createMovie);
//put is used when entire document needs to be update
// router.patch('/update-movie-without-poster/:movieId',
// isAuth,isAdmin,
// //parseData,
// validateMovie,validate,updateMovieWithoutPoster);

router.patch('/update/:movieId',
isAuth,isAdmin,
uploadImage.single('poster'),
parseData,
validateMovie,validate,updateMovie);

router.delete('/:movieId',isAuth,isAdmin,removeMovie);
router.get('/movies',isAuth,isAdmin,getMovies);
router.get('/for-update/:movieId',isAuth,isAdmin,getMovieForUpdate);
router.get('/search',isAuth,isAdmin,searchMovies);

//for normal users
router.get('/latest-uploads',getLatestUploads);
router.get('/single/:movieId',getSingleMovie);
router.get('/related/:movieId',getRelatedMovies);
router.get('/top-rated',getTopRatedMovies);
router.get('/search-public',searchPublicMovies);
module.exports = router;