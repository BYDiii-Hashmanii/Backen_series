import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        refreshTokenHash: {
            type: String,
            required: [true,"refresh Token is Required"],
        },

        ip: {
            type: String
            , require: [true, "Ip Address is Required"]
        },
        userAgent: {
            type: String,
            require: [true, "User Agent is Required"]
        },
        revoked: {
            type: Boolean,
            default: false
        },

    },
    {
        timestamps: true,
    }
);

const sessionModel = mongoose.model("Session", sessionSchema);

export default sessionModel;