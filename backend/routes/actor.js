const express = require('express');
const { createActor, updateActor, removeActor, searchActor, getlatestActors, getSingleActor, getActors } = require('../controllers/actor');
const { isAuth, isAdmin } = require('../milddlewares/auth');
const { uploadImage } = require('../milddlewares/mutler');
const { actorInfoValidator, validate } = require('../milddlewares/validator');
const router = express.Router();

router.post('/create',isAuth,isAdmin,uploadImage.single('avatar'),actorInfoValidator,validate,createActor);
router.post('/update/:actorId',isAuth,isAdmin,uploadImage.single('avatar'),actorInfoValidator,validate,updateActor);
router.delete('/delete/:actorId',isAuth,isAdmin,removeActor);
router.get('/search',isAuth,isAdmin,searchActor);
router.get('/latest-uploads',isAuth,isAdmin,getlatestActors);
router.get('/actors',isAuth,isAdmin,getActors);
router.get('/single/:id',getSingleActor);

module.exports = router;