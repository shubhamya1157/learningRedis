import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);


/*

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



*/




app.post("/otp", async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                message: "Phone number is required",
            });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Store OTP in Redis for 2 minutes
        await redis.set(`OTP:${phone}`, otp.toString(), "EX", 120);

        const ttl = await redis.ttl(`OTP:${phone}`);

        
        return res.status(200).json({
            message: "OTP generated successfully",
            otp, // Remove this in production
            expiresIn: ttl,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

app.post("/otp/verify/:phone", async (req, res) => {
    try {
        const { phone } = req.params;
        const { otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                message: "Phone number and OTP are required",
            });
        }

        const exists = await redis.exists(`OTP:${phone}`);

        if (!exists) {
            return res.status(404).json({
                message: "OTP expired or not found",
            });
        }

        const storedOtp = await redis.get(`OTP:${phone}`);

        if (storedOtp !== String(otp)) {
            return res.status(401).json({
                message: "Invalid OTP",
            });
        }

        // OTP verified, remove it so it can't be reused
        await redis.del(`OTP:${phone}`);

        return res.status(200).json({
            message: "OTP verified successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});







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