const { check, validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');
const genres = require('../utils/genres');

exports.userValidator = [
    check('name').trim().not().isEmpty().withMessage("Name is missing"),
    check('email').normalizeEmail().isEmail().withMessage('Email is invalid'),
    check('password').trim().not().isEmpty().withMessage("Password is missing").
        isLength({ min: 8, max: 20 }).withMessage('Password must be 8 to 20 characters long!')
];

//for validating the new password given by user for reseting password
exports.validatePassword = [
    check('newPassword').trim().not().isEmpty().withMessage("Password is missing").
        isLength({ min: 8, max: 20 }).withMessage('Password must be 8 to 20 characters long!')
];

exports.signInValidator = [
    check('email').normalizeEmail().isEmail().withMessage('Email is invalid'),
    check('password').trim().not().isEmpty().withMessage("Password is missing")
];

exports.actorInfoValidator = [
    check('name').trim().not().isEmpty().withMessage("Actor name is missing"),
    check('about').trim().not().isEmpty().withMessage("About is a required field"),
    check('gender').trim().not().isEmpty().withMessage("Gender is a required field"),
];


exports.validateMovie = [
    check('title').trim().not().isEmpty().withMessage("Movie message is missing"),
    check('storyLine').trim().not().isEmpty().withMessage("storyLine is important"),
    check('language').trim().not().isEmpty().withMessage("language is missing"),
    check('releseDate').isDate().withMessage("Release Date is missing"),
    check('status').isIn(['public', 'private']).withMessage("Movie status must be public or private"),
    check('type').trim().not().isEmpty().withMessage("Movie type is missing"),
    check('genres').isArray().withMessage("Genres must be an array").custom((value) => {
        for (let g of value) {
            if (!genres.includes(g)) throw Error('Invalid genres')
        }
        return true;
    }),
    check('tags').isArray({ min: 1 }).withMessage('Tags must be an array of strings')
        .custom((tags) => {
            for (let tag of tags) {
                if (typeof tag !== 'string') throw Error('Tags must be an array of strings')
            }
            return true;
        }),
    check('cast').isArray().withMessage("Genres must be an array").custom((cast) => {
        for (let c of cast) {
            if (!isValidObjectId(c.actor)) throw Error('Invalid cast id inside cast!')
            if (!c.roleAs?.trim()) throw Error('RoleAs is missing inside cast.')
            if (typeof c.leadActor !== 'boolean') 
            throw Error('Only accepted boolean value inside leadActor inside cast.')
        }
        return true;
    }),
    // check('trailer').isObject().withMessage('trailer be an object with url and public_id')
    //     .custom(({ url, public_id }) => {
    //         try {
    //             const result = new URL(url);
    //             if (!result.protocol.includes('http')) throw Error('Trailer url is invalid!')
    //             const arr = url.split('/');
    //             const public_Id = arr[arr.length - 1].split('.')[0]; //first we get the last portion after /, then in that portion we will remove .jpg or .mp4 to get public_id
    //             //  https://res.cloudinary.com/ravnoor-project-files/image/upload/v1675865734/aslaz7l2nvf0pxhk2ury.jpg
    //             if (public_Id !== public_id) throw Error('trailer public_id is invalid')
    //             return true;
    //         } catch (error) {
    //             throw Error('Trailer url is invalid!');
    //         }
    //     }),
    // check('poster').custom((value, { req }) => {
    //     if (!req.file) throw Error('Poster file is missing!');
    //     return true;
    // })
]

exports.ValidateTrailer = check('trailer').isObject().withMessage('trailer be an object with url and public_id')
    .custom(({ url, public_id }) => {
        try {
            const result = new URL(url);
            if (!result.protocol.includes('http')) throw Error('Trailer url is invalid!')
            const arr = url.split('/');
            const public_Id = arr[arr.length - 1].split('.')[0]; //first we get the last portion after /, then in that portion we will remove .jpg or .mp4 to get public_id
            //  https://res.cloudinary.com/ravnoor-project-files/image/upload/v1675865734/aslaz7l2nvf0pxhk2ury.jpg
            if (public_Id !== public_id) throw Error('trailer public_id is invalid')
            return true;
        } catch (error) {
            throw Error('Trailer url is invalid!');
        }
    }),
check('poster').custom((value, { req }) => {
    if (!req.file) throw Error('Poster file is missing!');
    return true;
})

exports.validateRatings = check('rating','Rating must be a number between 0 and 10').
    isFloat({min:0,max:10});

exports.validate = (req, res, next) => {
    const err = validationResult(req).array();
    console.log(err);
    if (err.length) {
        return res.json({ error: err[0].msg })
    }
    next();
};