import mongoose from "mongoose";
import Greener from './GreenerSchema.js'

const reviewSchema = new mongoose.Schema(
  {
    greener: {
      type: mongoose.Types.ObjectId,
      ref: "Greener",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (greenerId) {
  const stats = await this.aggregate([
    {
      $match: { greener: greenerId }
    },
    {
      $group: {
        _id: '$greener',
        numOfRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await Greener.findByIdAndUpdate(greenerId, {
    totalRating: stats[0].numOfRating,
    averageRating: stats[0].avgRating,
  });
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.greener);
});

export default mongoose.model("Review", reviewSchema);
