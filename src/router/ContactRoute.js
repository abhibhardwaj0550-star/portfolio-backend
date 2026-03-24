import express from "express";
import { sendContactMessage } from "../Controller/contactController.js";

const router = express.Router();

router.post("/", sendContactMessage);

export default router;
