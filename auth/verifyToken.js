import jwt from 'jsonwebtoken';
import User from '../models/UserSchema.js';
import Greener from '../models/GreenerSchema.js';

export const authenticate = async (req, res, next) => {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'no token, authorization denied' });
    }

    try {
        const token = authToken.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.userId = decoded.id;
        req.role = decoded.role;
        // console.log(authToken);
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'token expired' });
        }
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
export const restrict = roles => async (req, res, next) => {
    const userId = req.userId;
    let user;

    // Find the user by ID in both User and Greener models
    const patient = await User.findById(userId);
    const greener = await Greener.findById(userId);

    // Check if either patient or greener is defined and set user accordingly
    if (patient) {
        user = patient;
    } else if (greener) {
        user = greener;
    }

    // Check if user is defined and has the required role
    if (!user || !roles.includes(user.role)) {
        return res.status(401).json({ success: false, message: 'You are not authorized' })
    }

    // If user is defined and has the required role, proceed to the next middleware
    next();
};
