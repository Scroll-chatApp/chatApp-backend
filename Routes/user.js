import express from "express";
import { getAllUsers } from "../Controller/user.js";

const router = express.Router();

router.get("/getallusers", getAllUsers);

export default router;
