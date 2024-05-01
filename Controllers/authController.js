import User from '../models/UserSchema.js';
import Greener from '../models/GreenerSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = user => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: '15d',
    });
};

export const register = async (req, res) => {
    const { email, password, name, role, photo, gender } = req.body;
    try {
        let user = null;
        if (role === 'patient') {
            user = await User.findOne({ email });
        }
        else if (role === 'greener') {
            user = await Greener.findOne({ email });
        }

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        if (role === 'patient') {
            user = new User({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            });
        }
        if (role === 'greener') {
            user = new Greener({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            });
        }
        await user.save();

        res.status(200).json({ success: true, message: 'User successfully created' });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error, try again' });
    }
};

export const login = async (req, res) => {
    const { email } = req.body
    try {


        let user = null

        const patient = await User.findOne({ email })
        const greener = await Greener.findOne({ email })

        if (patient) {
            user = patient
        }
        if (greener) {
            user = greener
        }

        // check if user exist or not
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        // compare password
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ status: false, message: "invalid credentials" });
        }

        // get token
        const token = generateToken(user);

        const { password, role, appointments, ...rest } = user._doc;

        res
            .status(200)
            .json({ status: true, message: "Successfully login", token, data: { ...rest }, role, });

    } catch (err) {
        res
            .status(500)
            .json({ status: false, message: "Failed to login" });
    }
};
