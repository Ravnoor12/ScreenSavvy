const multer = require('multer');
const storage = multer.diskStorage({});

const ImageFileFilter = (req,file,cb) =>{
    if(!file.mimetype.startsWith('image')){
        cb('supported only image files!',false);
    }
    console.log(file);
    cb(null,true);
};

const VideoFileFilter = (req,file,cb) =>{
    if(!file.mimetype.startsWith('video')){
        cb('supported only video files!',false);
    }
    console.log(file);
    cb(null,true);
};

exports.uploadImage = multer({storage,ImageFileFilter});
exports.uploadVideo = multer({storage,VideoFileFilter});
