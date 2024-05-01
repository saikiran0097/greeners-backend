import Greener from '../models/GreenerSchema.js';
import Booking from '../models/BookingSchema.js';

export const updateGreener = async (req, res) => {
    const id = req.params.id;

    try {
        const updateGreener = await Greener.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({ status: true, message: "Successfully updated" });
    } catch (err) {
        res.status(500).json({ status: true, message: "Failed to update" });
    }
}
export const deleteGreener = async (req, res) => {
    const id = req.params.id;

    try {
        await Greener.findByIdAndDelete(
            id,

        );
        res.status(200).json({ status: true, message: "Successfully deleted" });
    } catch (err) {
        res.status(500).json({ status: true, message: "Failed to delete" });
    }
}
export const getSingleGreener = async (req, res) => {
    const id = req.params.id;
    try {
        const greener = await Greener.findById(id).populate("reviews").select('-password');
        res.status(200).json({ status: true, message: "Greener found", data: greener });
    } catch (err) {
        res.status(500).json({ status: true, message: "No Greener found" });
    }
}
export const getAllGreener = async (req, res) => {
    try {
        const { query } = req.query;
        let greeners;
        if (query) {
            greeners = await Greener.find({
                isApproved: 'approved',
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { specialization: { $regex: query, $options: 'i' } },
                ],
            }).select('-password');
        } else {
            greeners = await Greener.find({ isApproved: 'approved' }).select('-password');
        }
        res.status(200).json({ status: true, message: "Greeners found", data: greeners });
    } catch (err) {
        res.status(500).json({ status: true, message: "Not found" });
    }
}

export const getGreenerProfile = async (req, res) => {
    const greenerId = req.userId
    try {
        const greener = await Greener.findById(greenerId)

        if (!greener) {
            return res.status(404).json({ status: false, message: "Greener not found" });
        }

        const { password, ...rest } = greener._doc
        const appointments = await Booking.find({ greener: greenerId })

        res.status(200).json({ status: true, message: "Profile info is getting", data: { ...rest, appointments } });
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        res.status(500).json({ status: false, message: "Something went wrong" });
    }
}