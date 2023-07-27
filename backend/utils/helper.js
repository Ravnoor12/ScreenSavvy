const crypto = require('crypto');
const cloudinary = require('../cloud');
const actor = require('../models/actor');
const Review = require('../models/review');

// dynamic function for sending errors with diff status
exports.sendError = (res,error,statusCode=401) => {
    res.status(statusCode).json({error}); 
}

//for sending token for password reset
exports.generateRandomByte = () => {
    return new Promise((resolve,reject)=>{
        crypto.randomBytes(30,(err,buff)=>{
            if(err) reject(err);
            const buffString = buff.toString('hex');

            console.log(buffString)
            resolve(buffString);
        });
    });
};

exports.handleNotFound = (req,res)=>{
    this.sendError(res,'Not Found',404)  //this. because sendError is written in this file itself
}

exports.uploadImageToCloud = async(file)=>{
    const {secure_url:url,public_id} = await cloudinary.uploader.upload(file,
        {gravity: "face", height: 150, width: 150, crop: "thumb"}); 
    return {url,public_id};
}

exports.formatActor = actor => {
    const {name,gender, about,_id,avatar} = actor;
    return {id:_id,name,about,gender,avatar:avatar?.url};
}

exports.parseData = (req,res,next)=> {
    const {trailer,cast,genres,tags,writers} = req.body;
    if(trailer) req.body.trailer = JSON.parse(trailer);
    if(cast) req.body.cast = JSON.parse(cast);
    if(genres) req.body.genres = JSON.parse(genres);
    if(tags) req.body.tags = JSON.parse(tags);
    if(writers) req.body.writers = JSON.parse(writers);
    next();
}

exports.averageRatingPipeline = (movieId)=>{
    return [
        {
            $lookup:{  //lookup operator, this is join operator
                from:"Review",
                localField:"rating", //go to reviews and pick field rating
                foreignField:'_id',
                as:"avgRat"
            },
        },
        {
            $match:{parentMovie:movieId}
        },
        {
            $group:{
                _id:null, // doing id null will make new separate objects
                ratingAvg:{
                    $avg:'$rating' //average of rating field
                },
                reviewCount:{
                    $sum:1 // add 1 for 1 review to sum
                }
            }
        }
    ]
}

exports.relatedMovieAggregation = (tags,movieId)=>{
    return [
        {
            $lookup:{
                from:'Movie',
                localField:'tags',
                foreignField:'_id',
                as:'relatedMovies'
            }
        },
        {
            $match:{
                tags:{
                    $in:[...tags]   //check if any tag matching with current movie tag is in present
                },
                _id:{
                    $ne:movieId  //ne is not equal to i.e we are excluding the current movie 
                }
            }
        },
        {
            $project:{
                title: 1, //1 to select and 0 if not select, this project is like map function to show additional fields
                poster:'$poster.url',  //selecting only poster url not trailer url
                responsivePosters:'$poster.responsive',
            }
        },
        {
            $limit:5 //select only 5
        }
    ]
}

exports.topRatedMoviesPipeline = (type)=>{
    const matchOptions = {
        reviews:{$exists:true}, //exists means that there must be reviews
        status:{$eq: 'public'}, //eq means equal to 
    }
    if(type) matchOptions.type = {$eq:type}


    return [
        {
            $lookup:{
                from:'Movie',
                localField:'reviews',
                foreignField:'_id',
                as:'topRated'
            }
        },
        {
            $match: matchOptions,
        },
        {
            $project:{
                title:1,
                poster:'$poster.url',
                responsivePosters: '$poster.responsive',
                reviewCount:{$size:'$reviews'}
            }
        },
        {
            $sort:{reviewCount:-1} //sort all movies in descending order, default is ascending order
        },
        {
            $limit:5
        }
    ]
}

exports.getAverageRatings = async(movieId)=>{
    const [aggregatedResponse] = await Review.aggregate(this.averageRatingPipeline(movieId)) //we have to pass object id not movieId directly, movieId is string
    //console.log(aggregatedResponse);

    const reviews = {};
    if(aggregatedResponse){
        const {ratingAvg,reviewCount} = aggregatedResponse;
        reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
        reviews.reviewCount =reviewCount;

    }
    return reviews;
}