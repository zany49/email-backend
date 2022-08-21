
import User from '../models/user'
import { hashPassword,comparePassword } from '../helpers/auth'
import jwt from 'jsonwebtoken';
import {nanoid} from 'nanoid';
import Crypto from 'crypto';
import nodemailer from 'nodemailer';
// import Token from '../models/token';

const { ObjectID } = require('mongodb');



export const register =async(req, res)=>{
    // console.log("your registered",req.body);
    var{username,password,confirmpassword} = req.body;
    username = username+"@mymail.abz"
    console.log("username--->",username)
    //validation
    if(!username){ 
    return res.json({
        error:"User Name Is Required"

    })
  }

    if(!password || password.length< 6) 
    {
      return res.json({error:"Pasword length must be above 6 characters"})
    }

    if(confirmpassword!==password){
      return res.json({error:"Pasword does'nt match"})
    }
     
     
    
    const existing = await User.findOne({username});
    console.log("existing-->",existing)
     if (existing) 
     {
        return res.json({error:"username is already in use"})
     }

     console.log("name--->",username+"@mymail.abz")
     
   //hash pwd
    const hashPwd = await hashPassword(password);

    const user = new User({
      username:username,  
      password: hashPwd,
      dubpassword: password
    });
    try{
      await user.save();
      console.log("sucessful", user);
  
      return res.json({
          data:user,
          ok: true,
      })
    }catch(err){
       console.log("register failed",err);
       {
         return res.json({error:"error,try again"})
       }
       
    }
};




//giving jwt token to the user to access the page.
export const login = async (req, res)=>{
try{
    // console.log(req.body);
    //check if the user with that email 
    const {username , password}= req.body;
    const user = await User.findOne({ username })
    if(!user)  
    {
      return res.json({error:"No User Email Found"})
    }
    //check password
    const match = await comparePassword(password, user.password)
    if(!match) 
    {
      return res.json({error:"Wrong password"})
    }
    //using jwt singin token
    const token = jwt.sign({_id: user.id},process.env.JWT_SECRET,{
      expiresIn: "7d", //20sec for test
    });
    //to not send the password and secret to the front end after login
    user.password = undefined;
    user.secret = undefined;

    res.json({
      token,
      user,
    })

}catch(err){
    console.error(err);
    {
      return res.json({error:"error,try again"})
    }
}
};


//to secure the dashboard using post man - jwt stored locally - to refusethe access in another tab 
export const currentUser =async(req,res) =>{
try{
    const user = await User.findOne(req.user_id);
    // res.json(user);
    res.json({ok: true})
}catch(err){
  console.log(err);
  res.sendStatus(400);
}
};



export const forgotPassword = async(req, res)=>{ 
    // console.log(req.body);
    const verifyuser = await User.findById(req.params.userId);
       if (!verifyuser) return res.json({
         error:"invalid link "
        });

        const token = await Token.findOne({
          userId: verifyuser._id,
          token: req.params.token,
      });
      if (!token) return  res.json({
        error:"invalid link or expired"
       });


  const {email, newpassword} = req.body;
  // validation
  if(!newpassword || newpassword <= 6){
    return res.json({
      error: 'Invalid new password enter more than 6 characters'
    })
  }
  
  const user = await User.findOne({email});
  if(!user){
   return res.json({
      error: 'user not found',
    })
  }
  try{
    const hashed = await hashPassword(newpassword);
    await User.findByIdAndUpdate(user._id, {password: hashed});
    await token.delete();
    res.json({
      success: "Password has been Updated.",
    })
  }catch(err){
    console.log(err);
    return res.json({
        error: 'Something went wrong,Try Again!'
      })
    
  }
}

export const findPeople = async (req, res)=>{
  try{
  
    const user = await User.find({}).select('-password')
  .limit(10);
    
    res.json(user);
  }catch(err){
    console.log(err);
  }
}








