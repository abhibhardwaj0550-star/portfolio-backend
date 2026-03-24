import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import ContactRoutes from "../src/router/ContactRoute.js"
dotenv.config();

const app =express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,POST",
    credentials: true
}));
mongoose
.connect(process.env.MONGO_URI)
.then(()=> console.log(" Mongo Db connected"))
.catch((err)=> console.log("Mongo db eroor:", err.message));


app.use("/mail", ContactRoutes);

app.get("/", (req,res)=>{
    res.send("Api is working");
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Server rumming on port ${PORT}`);
});