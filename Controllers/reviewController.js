import Review from '../models/ReviewSchema.js';
import Greener from '../models/GreenerSchema.js';

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({});

        res.status(200).json({ status: true, message: "Successful", data: reviews });
    } catch (err) {
        res.status(404).json({ status: false, message: "Not found" });
    }
};

export const createReview = async (req, res) => {
    if (!req.body.greener) req.body.greener = req.params.greenerId;
    if (!req.body.user) req.body.user = req.params.userId;

    const newReview = new Review(req.body);

    try {
        const savedReview = await newReview.save();

        await Greener.findByIdAndUpdate(req.body.greener, {
            $push: { reviews: savedReview._id }
        });

        res.status(200).json({ status: true, message: "Review submitted", data: savedReview });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};