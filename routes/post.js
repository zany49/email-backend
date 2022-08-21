import  express  from "express";

import  formidable from "express-formidable";
//middleware
import {requireSignin} from "../middleware/auth";
import {createmail,getsentEmail,getAllEmail,getIdEmail
} from "../controllers/post"

const router = express.Router();

router.post('/create-mail',requireSignin,createmail);

router.get('/get-sentmail/:id',requireSignin,getsentEmail)
router.get('/get-allmail/:id',requireSignin,getAllEmail)
router.get('/get-mail/:id',requireSignin,getIdEmail)


module.exports= router;