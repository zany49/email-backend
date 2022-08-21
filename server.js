import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from "dotenv";
import { readdirSync } from "fs";


const app = express();
dotenv.config();



const PORT = process.env.PORT ;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then(()=>console.log('Connected to db'))
.catch((err)=> console.log("DB connection error",err));

//middleware

app.use(express.json({limit:"5mb"})); //limiting the data size
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: [process.env.CLIENT_URL],
}));

//autoload routes
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));


app.listen(PORT,()=>console.log('connected to db',PORT))

