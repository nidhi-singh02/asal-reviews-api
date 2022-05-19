const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  reviewID: {
    type: String,
  },
  userID: {
    type: String,
  },
  content: {
    type: String,
  },
  product: {
    type: String,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  upvoteBy: [{ type: String }], // assign user id
  cts: {
    type: Date,
  },
  uts: {
    type: Date,
  },
  report: {
    type: String,
  },
  rating: {
    type: Number,
  },
  serviceprovider: {
    type: String,
  },
});

module.exports = mongoose.model("reviewdetails", ReviewSchema);
