const { sendError } = require("../utils/helper");
const jwt = require('jsonwebtoken');
const User = require("../models/user");

exports.isAuth = async(req,res,next)=>{
    const token = req.headers.authorization;
    if(!token) return sendError(res,'Token is required');
    const jwtToken = token.split('Bearer ')[1];
    if(!jwtToken) return sendError(res,'Invalid token!');
    const jwtRes = jwt.verify(jwtToken,process.env.JWT_SECRET);
    const {userId} = jwtRes;
    const user = await User.findById(userId);
    if(!user) return sendError(res,'Invalid Token user not found',404);
    req.user = user;
    //console.log(user);
    next();
}

exports.isAdmin = (req,res,next) =>{
    const {user} = req;
    if(user.role !=='admin') return sendError(res,'Unauthorized access');
    next();
}