import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("Mongo Uri is not defined in env file");
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT Secret is Not defined in env file");
}

const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET
}

export default config;