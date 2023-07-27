const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actor");
const { sendError, uploadImageToCloud, formatActor } = require("../utils/helper");
const cloudinary = require('../cloud');

exports.createActor = async(req,res)=>{
    const {name,about,gender} = req.body;
    const file = req.file;
    // console.log(req.body);
    const newActor = new Actor({name,about,gender});
    // console.log(file);
    if(file){
        const {url,public_id} = await uploadImageToCloud(file.path);
        //console.log(url+ " "+ public_id);
        //console.log("After first console");
        newActor.avatar = {url,public_id};
    }
    await newActor.save();
    //console.log(newActor);
    res.status(201).json({actor:formatActor(newActor)});
}

exports.updateActor = async(req,res)=>{
    const {name,about,gender} = req.body;
    const file = req.file;
    const {actorId} = req.params;   
    if(!isValidObjectId(actorId)) return sendError(res,'Invalid request!');
    const actor = await Actor.findById(actorId);
    if(!actor) return sendError(res,'Invalid request, record not found!');

    const public_id = actor.avatar?.public_id;
    //remove old image if there is one
    if(public_id && file){
        const {result} = await cloudinary.uploader.destroy(public_id);
        console.log(result);
        if(result !=='ok'){
            return sendError(res,'Could not remove image from cloud!');
        }
    }
    if(file){
        const {secure_url,public_id} = await uploadImageToCloud(file.path);
        actor.avatar = {url:secure_url,public_id};
    }
    actor.name=name;
    actor.about=about;
    actor.gender=gender;

    await actor.save();
    res.status(201).json({actor : formatActor(actor)});
}

exports.removeActor = async(req,res) =>{
    const {actorId} = req.params;   
    if(!isValidObjectId(actorId)) return sendError(res,'Invalid request!');
    const actor = await Actor.findById(actorId);
    if(!actor) return sendError(res,'Invalid request, record not found!');

    const public_id = actor.avatar?.public_id;
    if(public_id){
        const {result} = await cloudinary.uploader.destroy(public_id);
        console.log(result);
        if(result !=='ok'){
            return sendError(res,'Could not remove image from cloud!');
        }
    }
    await Actor.findByIdAndDelete(actorId);
    res.json({message: 'Record removed successfully.'});
}

exports.searchActor = async(req,res)=>{
    const {name} = req.query;
    // const result = await Actor.find({ $text:{$search: `"${query.name}"`}});
    if(!name.trim()) return sendError(res,'Invalid request!')
    const result = await Actor.find({ name:{$regex:name,$options:'i'} }); //options:'i' means searching of name irrespective of captial or small letters
    const actors = result.map(actor => formatActor(actor));
    res.json({results:actors});
}

exports.getlatestActors = async(req,res)=>{
    const result = await Actor.find().sort({createdAt: '-1'}).limit(12)  // it will sort the actors acc to the latest time, i.e the one created at latest time will be first 
    const actors = result.map(actor => formatActor(actor));
    res.json(result);
}

exports.getSingleActor = async(req,res)=>{
    const {id} = req.params;
    if(!isValidObjectId(id)) return sendError(res,'Invalid request!');
    const actor = await Actor.findById(id);
    if(!actor) return sendError(res,'Invalid request,actor not found!',404);
    res.json({actor: formatActor(actor)});
}

exports.getActors = async(req,res)=>{
    const {pageNo,limit} = req.query;
    console.log(parseInt(pageNo) + " " + parseInt(limit));
    const actors = await Actor.find({})
    .sort({createdAt: -1})  // sorting acc to they are filled into database i.e latest ones first
    .skip(parseInt(pageNo)*parseInt(limit)) // skip the values which are  on previous page
    .limit(parseInt(limit)) // this will select only limit no of values i.e if limit(5) then only 5 items
    const profiles = actors.map(actor=> formatActor(actor))
    res.json({
        profiles 
    })
}