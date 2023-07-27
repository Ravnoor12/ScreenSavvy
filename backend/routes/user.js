const express = require('express');
const jwt = require('jsonwebtoken');

const { createUser, verifyEmail, resendEmailVerification, forgetPassword, sendResetPasswordTokenStatus, resetPassword, signIn } = require('../controllers/user');
const { isAuth } = require('../milddlewares/auth');
const { isValidpasswordResetToken } = require('../milddlewares/user');
const { userValidator,validate, validatePassword, signInValidator } = require('../milddlewares/validator');
const User = require('../models/user');
const { sendError } = require('../utils/helper');

const router = express.Router();

router.post('/create',userValidator,validate,createUser);
router.post('/signin',signInValidator,validate,signIn);
router.post('/verify-email',verifyEmail);
router.post('/resend-email-verification-token',resendEmailVerification);
router.post('/forget-password',forgetPassword);
router.post('/verify-password-reset-token',isValidpasswordResetToken,sendResetPasswordTokenStatus);
router.post('/reset-password',validatePassword,validate,isValidpasswordResetToken,resetPassword);

router.get('/is-auth',isAuth,(req,res) =>{
    const {user} = req;
    res.json({user:{id: user._id,name:user.name,email:user.email,isVerified: user.isVerified,role:user.role}});
})

module.exports = router;