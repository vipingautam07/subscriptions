import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } 
    catch(error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if(!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: user });
    } 
    catch(error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const { name, email, currency, profilePicture } = req.body;
        
        // Ensure user can only update their own profile unless admin
        if (req.user._id.toString() !== req.params.id) {
            const error = new Error('Not authorized to update this user');
            error.statusCode = 403;
            throw error;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { name, email, currency, profilePicture },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!updatedUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: updatedUser });
    } catch(error) {
        next(error);
    }
}
