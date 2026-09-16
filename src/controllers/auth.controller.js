import userModel from "../models/user.model.js";
import config from "../../config/config.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

export async function register(req, res) {
    const { username, email, password } = req.body;

    // Check if username OR email already exists
    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isAlreadyRegistered) {
        return res.status(409).json({
            message: "Username or Email already exists"
        });
    }

    // Hash password
    const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    // Create user
    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    });

    // Generate JWT
    const token = jwt.sign(
        {
            id: user._id
        },
        config.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return res.status(201).json({
        message: "User Registered Successfully",
        user: {
            username: user.username,
            email: user.email
        },
        token
    });
}


export async function all_users(req, res) {
    try {
        const users = await userModel.find();

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
}

export async function getMe(req,res)
{
const token = req.headers.authorization?.split(" ")[1]

if(!token){
    res.status(401).json({
        message:"token not found / UnAuthorized"
    })
}

const decoded = jwt.verify(token,config.JWT_SECRET)
// res.send(decoded)
const user =await userModel.findById(decoded.id)
if(user){
res.status(200).json({
    message:"User Found",
    success:true,
    user:user
})}
else{
res.status(401).json({
    message:"User Not Found"
})    
}

}