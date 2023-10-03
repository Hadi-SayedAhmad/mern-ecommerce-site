import path from "path"
import express from "express"
import multer from "multer"
const router = express.Router();


//where we want our images to go? in this case we need to be saved in the disk using multer
const storage = multer.diskStorage({
    //destination function: describe where we want to save our images
    destination(req, file, cb) { //cb is a callback to be executed
        cb(null, "uploads/"); // null is used for error check in first argument and second, the "uploads/" is for specifying where products should be saved in the root
    },
    //how we want our files to be named or formatted
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileType(file, cb) {
    //allowed types 
    const filetypes = /jpg|jpeg|png/; //this is a regular expression
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); //checking if extension of our original file is good
    //indicates the nature and format of a document
    const mimetype = filetypes.test(file.mimetype);;
    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb("Images Only (jpg, jpeg, png)!");
    }
}

const upload = multer({
    storage,
})

//upload.single is the middleware used to upload image, with a specific fieldname... in this case i used image
router.post("/", upload.single("image"), (req, res) => {
    res.send({
        message: "Image Uploaded!",
        image: `/${req.file.path}`
    })
})

export default router