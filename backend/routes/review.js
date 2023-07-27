const { addReview, updateReview, removeReview, getReviewByMovie } = require('../controllers/review');
const { isAuth } = require('../milddlewares/auth');
const { validateRatings, validate } = require('../milddlewares/validator');

const router = require('express').Router();

router.post('/add/:movieId',isAuth,validateRatings,validate,addReview);
router.patch('/:reviewId',isAuth,validateRatings,validate,updateReview);
router.delete('/:reviewId',isAuth,removeReview);
router.get('/get-review-by-movie/:movieId',getReviewByMovie);

module.exports = router;