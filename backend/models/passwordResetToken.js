const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const passwordResetTokenSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User, //name of the model is User
        required:true
    },
    token: {
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        expires: 3600,
        default: Date.now()
    }
});

passwordResetTokenSchema.pre("save",async function(next){ 
    if(this.isModified('token')){
        this.token = await bcrypt.hash(this.token,10); //hashing is asynchronus process so await
    } 
    next(); 
});

// creating custom method for comparing the otp with hashed otp
passwordResetTokenSchema.methods.compareToken = async function(token){    
    const result = await bcrypt.compare(token,this.token);
    return result;
}

module.exports = mongoose.model("PasswordResetToken",passwordResetTokenSchema);