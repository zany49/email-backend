import Mail from "../models/post";
import User from "../models/user"

const { ObjectID } = require('mongodb');




export const createmail = async (req,res)=>{

    const {content,sentBy,sentTo,title,category} = req.body;
    console.log("post",content,sentBy,sentTo,title,category)
   
   
    const user = await User.findOne({ username:sentTo })
    const currentuser = await User.findOne({ username:sentBy })
    console.log("currentuser",currentuser._id)
    console.log("user",user)
    if(!user)  
    {
      return res.json({error:"No User Found"})
    }
    if(sentBy===user.username){
        return res.json({error:"From and to must not be same"})
    }

 
    if(!title.length){
        return res.json(
            {
                error: 'Title is required',
            }
        );
    }
    if(!content.length){
        return res.json(
            {
                error: 'Content is required',
            }
        );

    }
    try{
            const mail = new Mail({content,title,category, sentBy:currentuser._id,sentTo:user._id,mailSent:true});
            await mail.save();
            console.log("mail saved",mail)

            const mailwithUser = await Mail.findById(mail._id)
            res.json(mailwithUser)
            //  res.json(mail);
       
    }catch(err){
        console.log(err);
        res.sendStatus(404);
    }



}


export const getsentEmail=async (req, res)=>{
    try {
      
        const id = req.params.id;
        const post = await Mail.find({sentBy: id})
        .sort({ createdAt: -1})
        .limit(10);
        console.log("post=>",post)
         res.json(post)
    }catch(err){
        console.log(err);
    }

}

export const getAllEmail=async (req, res)=>{
    try {
        
        const id = req.params.id;
        const post = await Mail.find({sentTo: id})
        .sort({ createdAt: -1}) 
        .limit(10);
        console.log("all mail=>",post)
         res.json(post)
    }catch(err){
        console.log(err);
    }

}

export const getIdEmail=async (req, res)=>{
    try {
        
        const id = req.params.id;
        console.log("iid-->",id)
        const post = await Mail.findById({_id: id})
        .sort({ createdAt: -1}) 
        .limit(10);
        console.log("id mail=>",post)
         res.json(post)
    }catch(err){
        console.log(err);
    }

}

















