const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim:true,
        required: true
    },
    email:{
        type: String,
        trim:true,
        required: true,
        unique: true
    },
    password:{
        type: String,  
        required: true
    },
    isVerified:{
        type: Boolean,  
        required: true,
        default: false
    },
    role: {
        type:String,
        required:true,
        default:'user',
        enum: ['admin','user']
    }
});

userSchema.pre("save",async function(next){ // whenever save is called, this function will get call before save run
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10); //hashing is asynchronus process so await
    } // this.password is means the password that we get using post req in user.js in conrtollers(newUser)
    next(); // next logic just like in middlewaress
})

//for comparing new password with old password while resetting the password 
userSchema.methods.comparePassword = async function(password){    
    const result = await bcrypt.compare(password,this.password);
    return result;
}

module.exports = mongoose.model("User",userSchema);