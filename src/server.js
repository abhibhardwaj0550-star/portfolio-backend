import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import ContactRoutes from "../src/router/ContactRoute.js"
dotenv.config();

const app =express();
app.use(express.json());
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://portfolio-react-phi-ten.vercel.app", // Fallback for production if ENV is missing
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
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