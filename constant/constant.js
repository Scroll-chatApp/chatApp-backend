import dotenv from "dotenv";

// dot evn package
dotenv.config();

export const cloud_name = process.env.cloud_name;
export const api_key = process.env.api_key;
export const api_secret = process.env.api_secret;
export const PORT = process.env.PORT;
export const MONGO_DB = process.env.MONGO_DB;
