import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            trim: true,
            match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please provide a valid email"]
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            trim: true,
        },
        photo: {
            type: String,
            default: "no-photo.jpg"
        },
        bio: {
            type: String,
            default: "Hi, nice to meet you! I am a new user."
        },
        role: {
            type: String,
            enum: ["user", "admin", "creator"],
            default: "user"
        },
        isVerified: {
            type: Boolean,
            default: false
        },
    }, 
    {
        timestamps: true, 
        minimize: true
    }
);

const User = mongoose.model('User', UserSchema);

export default User;