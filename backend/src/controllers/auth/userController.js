import asyncHandler from 'express-async-handler';
import User from '../../models/auth/userModel.js';
import generateToken from '../../utils/generateToken.js';
import bcrypt from 'bcrypt';

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        // 400 Bad Request
        res.status(400).json({ message: "Please provide name, email and password" });
    }

    // Check password strength using regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        // 400 Bad Request
        res.status(400).json({ message: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if(userExists) {
        // 400 Bad Request
        res.status(400).json({ message: "User already exists" });
    }

    //create USer
    const user = await User.create({
        name,
        email,
        password
    });

    //generate token with user id
    const token = generateToken(user._id);
    
    //send back the user and token in the response to the client
    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: true,
        secure: true
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            photo: user.photo,
            bio: user.bio,
            isVerified: user.isVerified,
            token: token
        });
    } else {
        // 400 Bad Request
        res.status(400).json({ message: "Invalid user data" });
    }
});


//User Login
export const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        // 400 Bad Request
        res.status(400).json({ message: "Please provide email and password" });
    }

    // Check if user exists
    const userExists = await User.fineOne({ email });

    if(!userExists) {
        // 401 Unauthorized
        res.status(401).json({ message: "User not found, please sign up!" });
    }

    // Check if password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, userExists.password);

    if (!isMatch) {
        // 401 Unauthorized
        res.status(401).json({ message: "Invalid credentials!" });
    }

    //generate token with user id
    const token = generateToken(userExists._id);

    if (userExists && isMatch) {
        const { _id, name, email, role, photo, bio, isVerified } = userExists;

        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: true,
            secure: true
        });

        // send back the user and token in the response to the client
        res.status(200).json({
            _id,
            name,
            email,
            role,
            photo,
            bio,
            isVerified,
            token
        });
    } else {
        // 401 Unauthorized
        res.status(401).json({ message: "Invalid credentials!" });
    }

});