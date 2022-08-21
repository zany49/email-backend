import  mongoose  from "mongoose";

const { ObjectId } = mongoose.Schema;


const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:{},
        required: true,
    },
    category: {
        type: String,
        required:true,
    },
    sentBy:{
        type: ObjectId,
        ref: "User",
    },
    sentTo:{
        type: ObjectId,
        ref: "User",
    },
    mailSent:{
        type: Boolean,
        default: false
    },
    mailReceived:{
        type: Boolean,
        default: false
    },
    comments:[{
        text: String,
        created: {type:Date, default: Date.now},
        postedBy: {
            type: ObjectId,
            ref: "User",
        }
    }],
},
{
    collection:'mailData',
    timestamps:true
}
)


export default mongoose.model("Mail", postSchema)