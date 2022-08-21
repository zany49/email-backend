import  express  from "express";
import {
    register,
    login, 
    currentUser,
    forgotPassword,
    findPeople

}  
from "../controllers/auth"

//middleware
import {requireSignin} from "../middleware/auth";

const router = express.Router();

router.post('/register',register);

router.post('/login',login);
router.get('/current-user',requireSignin, currentUser);
router.post('/forgot-password/:resttoken/:userId',forgotPassword);
router.get('/find-user',requireSignin,findPeople);


module.exports= router;