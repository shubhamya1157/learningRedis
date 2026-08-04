import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);

const BANNER_KEY = "app:banner";

app.post("/banner" , async(req,res)=>{

    await redis.set(BANNER_KEY,req.body.message || "Welcome back");
    res.json({success : true})

})

app.get("/banner",async (req,res)=>{
    const message = await redis.get(BANNER_KEY);
    res.json({message});

})

app.delete("/banner",async (req,res)=>{
    await redis.del(BANNER_KEY);
    res.json({success : true})
})

app.get("/banner/exists",async (req,res)=>{
    const exist = await redis.exists(BANNER_KEY);
    res.json({exist:Boolean(exist)})
})




app.get("/",async(req,res)=>{
    res.send("hello from express server")
})

app.get("/redis",async(req,res)=>{
    const healthCheck = await redis.ping()
    res.json({redis:healthCheck});
})

app.listen(process.env.PORT,()=>{
    console.log(`your server is running on port ${process.env.PORT}`)
})