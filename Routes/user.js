import express from "express";
import { newUser } from "../Controller/user.js";

console.log("user = ", newUser);

const router = express.Router();

router.post("/newuser", newUser);

export default router;
