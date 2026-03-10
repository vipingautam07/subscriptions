import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

export const signUp = async (req, res, next) => {
    //sign up logic

    //To maintain acid properties in db
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        //check if existing user
        const existingUser = await User.findOne({ email });

        if(existingUser) {
            const error = new Error('User already exists');
            error.StatusCode = 409;
            throw error;
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{
            name,
            email,
            password: hashedpassword
        }], { session });

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0],
            }
        })
        console.log('User creted succesfully');

    }
    catch (error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    };
    
}

export const signIn = async (req, res, next) => {
    //sign in logic
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user) {
            const error = new Error('User not found');
            error.StatusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            const error = new Error('Invalid password');
            error.StatusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.status(200).json({
            success: true,
            message: 'user signed in successfully',
            data: {
                token,
                user
            }
        });
        console.log('user signed in successfully');

    }
    catch(error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    //sign out logic
    try {
        res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(200).json({ message: 'Successfully logged out' });
    } 
    catch (error) {
        res.status(500).json({ message: 'Error logging out', error: error.message });
    }
}