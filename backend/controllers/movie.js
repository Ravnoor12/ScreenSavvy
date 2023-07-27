const { sendError, formatActor, averageRatingPipeline, relatedMovieAggregation, topRatedMoviesPipeline, getAverageRatings } = require("../utils/helper");
const cloudinary = require('../cloud');
const Movie = require('../models/movie');
const mongoose = require("mongoose");
const Review = require("../models/review");
const { isValidObjectId } = mongoose;  

exports.uploadTrailer = async(req,res)=>{
    const {file} = req;
    if(!file) return sendError(res,'Video file is missing');

    const {secure_url:url,public_id} = await cloudinary.uploader.upload(file.path,{resource_type: 'video'});
    res.status(201).json({url,public_id});
}

exports.createMovie = async(req,res)=>{
    const {file,body} = req;
    const {
        title,
        storyLine,
        director,
        releseDate,
        status,
        type,
        genres,
        tags,
        cast,
        writers,
        trailer,
        language
    } =  body;


    const newMovie = new Movie({
        title,
        storyLine,
        releseDate,
        status,
        type,
        genres,
        tags,
        cast,
        trailer,
        language
    })
    if(director){
        if(!isValidObjectId(director)) return sendError(res,'Invalid director id!');
        newMovie.director = director;
    }
    if(writers){
        for(let writerId of writers){
            if(!isValidObjectId(writerId)) return sendError(res,'Invalid writer id!');
        }
        newMovie.writers = writers;
    }
    // uploading poster
    if(file){
    const {secure_url,public_id,responsive_breakpoints} = await cloudinary.uploader.upload(
        file.path,{
            transformation: {
                width:1280,
                height:720
            },
            responsive_breakpoints: {
                create_derived:true,
                max_width:640,
                max_images:3,
            }
        });
        const finalposter = {url:secure_url,public_id,responsive:[]};
        const {breakpoints} = responsive_breakpoints[0];
        if(breakpoints.length){
            for(let imgObj of breakpoints){
                const {secure_url} = imgObj;
                finalposter.responsive.push(secure_url);
            }
        }
        newMovie.poster = finalposter;
    }
        await newMovie.save();
        // console.log(cloudRes);
        // console.log(cloudRes.responsive_breakpoints[0].breakpoints);
        res.status(201).json({
            movie:{
                id:newMovie._id,
                title:title,
            }
        });
};

exports.updateMovieWithoutPoster = async(req,res)=>{
    const {movieId} = req.params;
    if(!isValidObjectId(movieId)) sendError(res,'Invalid Movie Id');
    const movie = await Movie.findById(movieId);
    if(!movie) return sendError(res,'Movie not found!',404);

    const {
        title,
        storyLine,
        director,
        releseDate,
        status,
        type,
        genres,
        tags,
        cast,
        writers,
        trailer,
        language
    } =  req.body;

    movie.title = title;
    movie.storyLine = storyLine;
    movie.tags = tags;
    movie.releseDate = releseDate;
    movie.status = status;
    movie.type = type;
    movie.genres = genres;
    movie.cast = cast;
    movie.trailer = trailer;
    movie.language = language;

    if(director){
        if(!isValidObjectId(director)) return sendError(res,'Invalid director id!');
        movie.director = director;
    }
    if(writers){
        for(let writerId of writers){
            if(!isValidObjectId(writerId)) return sendError(res,'Invalid writer id!');
        }
        movie.writers = writers;
    }
    await movie.save();
    res.json({message: 'Movie is updated',movie});
}


exports.updateMovie = async(req,res)=>{
    const {movieId} = req.params;
    const {file} = req;
    if(!isValidObjectId(movieId)) sendError(res,'Invalid Movie Id');
    //if(!req.file) return sendError(res,'Movie poster is missing!');
    const movie = await Movie.findById(movieId);
    if(!movie) return sendError(res,'Movie not found!',404);

    const {
        title,
        storyLine,
        director,
        releseDate,
        status,
        type,
        genres,
        tags,
        cast,
        writers,
        trailer,
        language
    } =  req.body;

    movie.title = title;
    movie.storyLine = storyLine;
    movie.tags = tags;
    movie.releseDate = releseDate;
    movie.status = status;
    movie.type = type;
    movie.genres = genres;
    movie.cast = cast;
    movie.language = language;

    if(director){
        if(!isValidObjectId(director)) return sendError(res,'Invalid director id!');
        movie.director = director;
    }
    if(writers){
        for(let writerId of writers){
            if(!isValidObjectId(writerId)) return sendError(res,'Invalid writer id!');
        }
        movie.writers = writers;
    }
    //update poster, removing poster from cloud if there is any
    if(file){
        const posterID = movie.poster?.public_id;
    if(posterID){
        const {result} = await cloudinary.uploader.destroy(posterID);
        if(result!=='ok'){
            return sendError(res,'could not update the poster at the moment');
        }
    }
    
    const {secure_url,public_id,responsive_breakpoints} = await cloudinary.uploader.upload(
        req.file.path,{
            transformation: {
                width:1280,
                height:720
            },
            responsive_breakpoints: {
                create_derived:true,
                max_width:640,
                max_images:3,
            }
        });
        const finalposter = {url:secure_url,public_id,responsive:[]};
        const {breakpoints} = responsive_breakpoints[0];
        if(breakpoints.length){
            for(let imgObj of breakpoints){
                const {secure_url} = imgObj;
                finalposter.responsive.push(secure_url);
            }
        }
        movie.poster = finalposter;
    }

    await movie.save();
    res.json({message: 'Movie is updated',movie:{
        id:movie._id,
        title:movie.title,
        poster:movie.poster?.url,
        genres:movie.genres,
        status:movie.status,
    }});
}


exports.removeMovie = async(req,res)=>{
    const {movieId} = req.params;
    if(!isValidObjectId(movieId)) sendError(res,'Invalid Movie Id');
    const movie = await Movie.findById(movieId);
    if(!movie) return sendError(res,'Movie not found!',404);
    //check if there is poster or not
    // if yes then we need to remove that
    console.log(movie.poster.public_id);
    console.log(movie.trailer.public_id);
    const posterID = movie.poster?.public_id;
    if(posterID){
        const {result} = await cloudinary.uploader.destroy(posterID);
        if(result!=='ok'){
            return sendError(res,'could not delete the poster at the moment');
        }
        console.log("poster :" + result);
    }
    //removing trailer  
    const trailerId = movie.trailer?.public_id;// since trailer is required,
    // so if it is not present so there is some error
    if(!trailerId) return sendError(res,'Could not find trailer in the cloud!');

    const {result} = await cloudinary.uploader.destroy(trailerId,{resource_type:'video'});
    if(result!=='ok') return sendError(res,'Could not remove trailer from cloud!');
    console.log("trailer :" + result);
    await Movie.findByIdAndDelete(movieId);
    res.json({message: 'Movie removed successfully.'})

}

exports.getMovies = async(req,res)=>{
    const {pageNo=0,limit=10} = req.query; 
    const movies = await Movie.find({})
    .sort({createdAt:-1})
    .skip(parseInt(pageNo)*parseInt(limit))
    .limit(parseInt(limit))
    const results = movies.map(movie=>{
        return {
            id:movie._id,
            title: movie.title,
            poster:movie.poster?.url,  // poster is optional thats why ?.url
            responsivePosters: movie.poster?.responsive,
            genres:movie.genres,
            status:movie.status
        }
    })
    //console.log(results);
    res.json({movies:results});
}

exports.getMovieForUpdate = async(req,res)=>{
    const {movieId} = req.params;
    if(!isValidObjectId(movieId)) return sendError(res,'Id is invalid!');
    const movie = await Movie.findById(movieId).populate('director writers cast.actor');
    res.json({movie:{
            id:movie._id,
            title:movie.title,
            storyLine:movie.storyLine,
            poster:movie.poster?.url,
            releseDate:movie.releseDate,
            status:movie.status,
            type:movie.type,
            language:movie.language,
            genres:movie.genres,
            tags:movie.tags,
            director:formatActor(movie.director),
            writers:movie.writers.map(w=>formatActor(w)),
            cast:movie.cast.map(c=>{
                return {
                    id: c.id,
                    profile: formatActor(c.actor), //profile bcoz in frontend CastForm, we are using profile
                    roleAs:c.roleAs, 
                    leadActor:c.leadActor
                }
            })
        }
    });
}

exports.searchMovies = async(req,res)=>{
    const {title} = req.query;
    if(!title.trim()) return sendError(res,'Invalid request');
    const movies = await Movie.find({title:{$regex:title,$options:'i'}}) //options:'i' means searching of name irrespective of captial or small letters
    res.json({results:movies.map(m=>{
        return {
            id:m._id,
            title:m.title,
            poster:m.poster?.url,
            genres:m.genres,
            status:m.status
        }
    })})
}


exports.getLatestUploads = async(req,res) =>{
    const {limit=5} = req.query;
    const results = await Movie.find({status:'public'}).sort('-createdAt').limit(parseInt(limit));
    const movies = results.map(m =>{
        return {
            id:m._id,
            title:m.title,
            storyLine: m.storyLine,
            poster: m.poster?.url,
            responsivePosters: m.poster.responsive,
            trailer: m.trailer?.url,
        }
    })
    res.json({movies});
}

exports.getSingleMovie = async(req,res)=>{
    const {movieId} = req.params;
    // mongoose.Types.ObjectId(movieId); //to convert movieId to objectid
    if(!isValidObjectId(movieId)) return sendError(res,'Movie id is not valid!');

    const movie = await Movie.findById(movieId).populate('director writers cast.actor');
    //console.log("checking difference between movieId and movie._id " + typeof(movieId) + " :: " + typeof(movie._id));
    const reviews = await getAverageRatings(movie._id);

    const {_id:id,
        title,
        storyLine,
        cast,
        writers,
        director,
        releseDate,
        genres,
        tags,
        language,
        poster,
        trailer,
        type} = movie
    res.json({movie:{
        id,
        title,
        storyLine,
        releseDate,
        genres,
        tags,
        language,
        type,
        poster:poster?.url,
        trailer:trailer?.url,
        cast:cast.map(c=>({
            id:c._id,
            profile:{id:c.actor._id ,name:c.actor.name,avatar:c.actor?.avatar?.url},
            leadActor: c.leadActor,
            roleAs:c.roleAs
        })),
        writers:writers.map(w=>({
            id:w._id,
            name:w.name
        })),
        director:{
            id:director._id,
            name:director.name
        },
        reviews:{...reviews},
    }});
}

exports.getRelatedMovies = async(req,res)=>{
    const {movieId} = req.params;
    if(!isValidObjectId(movieId)) return sendError(res,'Invalid movie id!');
    const movie = await Movie.findById(movieId);
    const movies = await Movie.aggregate(relatedMovieAggregation(movie.tags,movie._id));

    const mapMovies = async(m)=>{
        const reviews = await getAverageRatings(m._id) ;
        return {
            id:m._id,
            title:m.title,
            poster:m.poster,
            responsivePosters:m.responsivePosters,
            reviews:{...reviews}
        }
    }

    const relatedMovies = await Promise.all(
        movies.map(mapMovies)
    );

    res.json({movies : relatedMovies});
}


exports.getTopRatedMovies = async(req,res)=>{
    const {type='Film'} = req.query; //type is optional thats why default value is provided

    const movies = await Movie.aggregate(topRatedMoviesPipeline(type));

    const mapMovies = async(m)=>{
        const reviews = await getAverageRatings(m._id)
        return {
            id:m._id,
            title:m.title,
            poster:m.poster, 
            responsivePosters:m.responsivePosters,
            reviews:{...reviews}
        }
    }

    const topRatedMovies = await Promise.all(movies.map(mapMovies));
    res.json({movies:topRatedMovies});
}


exports.searchPublicMovies = async(req,res)=>{
    const {title} = req.query;
    if(!title.trim()) return sendError(res,'Invalid request');
    const movies = await Movie.find({title:{$regex:title,$options:'i'}, //options:'i' means searching of name irrespective of captial or small letters
    status:'public'}) 

    const mapMovies = async(m)=>{
        const reviews = await getAverageRatings(m._id)
        return {
            id:m._id,
            title:m.title,
            poster:m.poster?.url, 
            responsivePosters:m.poster?.responsive,
            reviews:{...reviews}
        }
    }

    const results = await Promise.all(movies.map(mapMovies));    

    res.json({results});
}


