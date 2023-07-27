const User = require('../models/user');
const EmailVerificationToken = require('../models/emailVerificationToken');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/user');
const { isValidObjectId } = require('mongoose');
const { generateOTP, generateMailTransporter } = require('../utils/mail');
const { sendError, generateRandomByte } = require('../utils/helper');
const PasswordResetToken = require('../models/passwordResetToken');


// const createUser = (req,res) =>{
//     res.send("<h1>hello this is user.js from routers</h1>");
// }

//module.exports = createUser; // this will only export createUser, to export more than one then we 
// can export a object of function like {createUser,sign in, reset-password} etc.

exports.createUser = async (req,res) =>{
    // console.log(req.body); 
    const {name, email, password} = req.body;
    const oldUser = await User.findOne({email});

    if(oldUser) return sendError(res,"this email is already in use!");
    // return console.log(oldUser);   
    const newUser = new User({name:name,email:email,password:password});
    await newUser.save();   

    let OTP = generateOTP();
    // for(let i=0;i<6;i++){
    //     const randomval = Math.round(Math.random()*9);
    //     OTP+=randomval;
    // }
    //store otp inside our db
    const newEmailVerificationToken = new EmailVerificationToken(
        {owner:newUser._id,token:OTP});
        await newEmailVerificationToken.save();
    console.log(newUser._id + " " + OTP);
    var transport = generateMailTransporter();
    
    transport.sendMail({
        from: 'verification@gmail.com',
        to: newUser.email,
        subject: 'Email Verification',
        html: `
            <p>Your Verification OTP</p>
            <h1>${OTP}</h1>
        `
    })
    // res.status(201).json({user : newUser});
    res.status(201).json({
        // message: "Please verify your email. OTP has been sent to your email account!"
        user:{
            id: newUser._id,
            name:newUser.name,
            email:newUser.email
        }
    });
};

exports.verifyEmail = async (req,res) => {
    const {userId,OTP} = req.body;
    if(!isValidObjectId(userId)) return res.json({error: "Invalid user!"});
    const user = await User.findById(userId);
    if(!user) return sendError(res,"User not found!",404); //404 means not found
    if(user.isVerified) return sendError(res,"User is already verified!");

    const token = await EmailVerificationToken.findOne({owner:userId});
    if(!token){
        console.log(userId);
        return sendError(res,"token not found");
    }

    const ismatched = await token.compareToken(OTP);
    if(!ismatched) return sendError(res,"please submit a valid OTP");
    user.isVerified=true;
    await user.save();

    await EmailVerificationToken.findByIdAndDelete(token._id);

    var transport = generateMailTransporter();
    
    transport.sendMail({
        from: 'verification@gmail.com',
        to: user.email,
        subject: 'Welcome email',
        html: `
            <h1>Welcome to our app. Thanks for choosing us </h1>
        `
    });

    const jwtToken = jwt.sign({userId: user._id},process.env.JWT_SECRET);
    res.json({user:
                {id:user._id,
                name:user.name,
                email:user.email,
                token:jwtToken,
                isVerified:user.isVerified,
                role:user.role
            }
        ,message: "your email is verified"});
};



exports.resendEmailVerification = async (req,res)=>{
    const {userId} = req.body;

    const user = await User.findById(userId);
    if(!user) return sendError(res,"User not found!");

    if(user.isVerified) return sendError(res,"This is email is already verfied");
    const alreadyHaveToken = await EmailVerificationToken.findOne({owner:userId});

    if(alreadyHaveToken) return sendError(res,"only after one hour you can request for another token");

    let OTP = generateOTP();
    //store otp inside our db
    const newEmailVerificationToken = new EmailVerificationToken(
        {owner:user._id,token:OTP});
        await newEmailVerificationToken.save();

    var transport = generateMailTransporter();
    
    transport.sendMail({
        from: 'verification@gmail.com',
        to: user.email,
        subject: 'Email Verification',
        html: `
            <p>Your Verification OTP</p>
            <h1>${OTP}</h1>
        `
    });
    res.json({message:"new otp has been sent to ur registered email account"})
}

exports.forgetPassword = async(req,res) => {
    const {email} = req.body;
    if(!email) return sendError(res,"Email is missing");

    const user = await User.findOne({email});
    if(!user) return sendError(res,"User not found!",404);

    const alreadyHasToken = await PasswordResetToken.findOne({owner: user._id});
    if(alreadyHasToken) return sendError(res,"Only after one hour you can request for another token!");

    const token = await generateRandomByte();
    const newPasswordResetToken = await PasswordResetToken({owner: user._id,token});
    await newPasswordResetToken.save();

    const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

    const transport = generateMailTransporter();
    
    transport.sendMail({
        from: 'security@gmail.com',
        to: user.email,
        subject: 'Reset Password Link',
        html: `
            <p>click here to reset password</p>
            <a href='${resetPasswordUrl}'>Change Password</a>
        `
    });

    res.json({message : 'link send to your email'});
}

exports.sendResetPasswordTokenStatus = (req,res) => {
    res.json({ valid:true });
}

exports.resetPassword = async(req,res) =>{
    const {newPassword,userId} = req.body;
    // if(!newPassword.trim() )
    
    const user = await User.findById(userId);
    const matched = await user.comparePassword(newPassword);
    if(matched) return sendError(res,'The new password must be different from the old password');
    user.password  = newPassword; //doesn't need to hash here because of pre function in user model 
                                  //which will hash automatically if it gets changed
    await user.save();

    await PasswordResetToken.findByIdAndDelete(req.resetToken._id);
    const transport = generateMailTransporter();
    
    transport.sendMail({
        from: 'security@gmail.com',
        to: user.email,
        subject: 'Password reset successfully',
        html: `
            <h1>Password reset successfully</h1>
            <p>Now you can use new password.</p>
        `
    });
    res.json({message:'Password reset successfully!'})
}


exports.signIn = async(req,res) => {
    const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user) return sendError(res,'Email/Password mismatch.');
        const matched = await user.comparePassword(password);

        if(!matched) return sendError(res,'Email/Password mismatch.');

        const {_id,name,role,isVerified} = user;
        const jwtToken = jwt.sign({userId: user._id},process.env.JWT_SECRET);
        res.json({user:{id:_id,name:name,email:user.email,role,token: jwtToken,isVerified}});
        // sendError(res, error.message);
}