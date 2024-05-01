import User from '../models/UserSchema.js';
import Greener from '../models/GreenerSchema.js';
import Booking from '../models/BookingSchema.js'

export const updateUser = async (req, res) => {
    const id = req.params.id;

    try {
        const updateUser = await User.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({ status: true, message: "Successfully updated" });
    } catch (err) {
        res.status(500).json({ status: true, message: "Failed to update" });
    }
}
export const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        await User.findByIdAndDelete(
            id,

        );
        res.status(200).json({ status: true, message: "Successfully deleted" });
    } catch (err) {
        res.status(500).json({ status: true, message: "Failed to delete" });
    }
}
export const getSingleUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id).select('-password');
        res.status(200).json({ status: true, message: "User found", data: user });
    } catch (err) {
        res.status(500).json({ status: true, message: "No user found" });
    }
}
export const getAllUser = async (req, res) => {

    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({ status: true, message: "Users found", data: users });
    } catch (err) {
        res.status(500).json({ status: true, message: "Not found" });
    }
}

export const getUserProfile = async (req, res) => {
    const userId = req.userId
    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        const { password, ...rest } = user._doc

        res.status(200).json({ status: true, message: "Profile info is getting", data: { ...rest } });
    } catch (err) {
        res.status(500).json({ status: false, message: "Something went wrong" });
    }
}

export const getMyAppointments = async (req, res) => {
    try {

        const bookings = await Booking.find({ user: req.userId })

        const greenerIds = bookings.map(el => el.greener.id)

        const greeners = await Greener.find({ _id: { $in: greenerIds } }).select('-password')

        res.status(200).json({ status: true, message: "Appointments are getting", data: greeners });

    } catch (err) {
        res.status(500).json({ status: false, message: "Something went wrong" });
    }
}