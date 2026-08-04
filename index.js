import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const redis = new Redis(process.env.REDIS_URL);


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