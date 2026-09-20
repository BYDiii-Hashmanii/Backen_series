import userModel from "../models/user.model.js";
import config from "../../config/config.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { Session } from "node:inspector";
import sessionModel from "../models/session.model.js";


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

    const refreshToken = jwt.sign(
        {
            id: user._id
        },
        config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    const hashedRefToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash: hashedRefToken,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    })

    // Generate JWT
    const accessToken = jwt.sign(
        {
            id: user._id,
            sessionId: session._id
        },
        config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );


    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        message: "User Registered Successfully",
        user: {
            username: user.username,
            email: user.email
        },
        accessToken
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

export async function getMe(req, res) {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        res.status(401).json({
            message: "token not found / UnAuthorized"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET)
    // res.send(decoded)
    const user = await userModel.findById(decoded.id)
    if (user) {
        res.status(200).json({
            message: "User Found",
            success: true,
            user: user
        })
    }
    else {
        res.status(401).json({
            message: "User Not Found"
        })
    }

}

export async function refreshToken(req, res) {
    const refToken = req.cookies.refreshToken;

    if (!refToken) {
        return res.status(401).json({
            message: "Refresh token not found"
        });
    }
    const decoded = jwt.verify(refToken, config.JWT_SECRET);

    const accessToken = jwt.sign(
        {
            id: decoded.id
        },
        config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )

    const newRefreshToken = jwt.sign(
        {
            id: decoded.id
        },
        config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "Access Token Generated Successfully",
        accessToken
    })

}

// Log out From Device ..
export async function logOut(req, res) {
    const refTok = req.headers.refreshToken;

    if (!refTok) {
        return res.status(401).json({
            message: "Access Token Not Found"
        })
    }




}



