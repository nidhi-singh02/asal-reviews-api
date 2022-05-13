const invoke = require("../invoke");
const appLogger = require("../Services/appLogger"),
  { nanoid } = require("nanoid"),
  database = require("../Services/dbconnect"),
  validator = require("../Utils/validator"),
  reviewModel = require("../Models/review");
const query = require('../query');
let channelID = "review", chaincodeID = "review";

module.exports.createReview = async (req, res) => {
  try {
    console.log("######## Inside Create Review #########");
    req.checkBody("rating", "Please provide Rating").notEmpty();
    req.checkBody("content", "Please enter your Content").notEmpty();
    req.checkBody("userID", "userID is required").notEmpty();
    req.checkBody("serviceprovider", "serviceprovider is required").notEmpty();
    req.checkBody("product", "Product Name is required").notEmpty();
    let validationResult = await validator(req);
    if (!validationResult.status) {
      res.status(422).json({
        status: 422,
        message: "Please enter correct data",
        error: validationResult.data,
      });
      return;
    }
    const timeStamp = Date.now();
    req.body.cts = timeStamp.toString();
    req.body.uts = timeStamp.toString();
    req.body.createdBy = "asalreview"

    let id = req.body.userID + makeid(5);
    console.log(id, "MAKEID");

    const reviewId = nanoid();
    let obj = req.body;
    obj.reviewID =  id //reviewId;

    let reviewObj = new reviewModel(obj);

   let data = await invoke.invoke(channelID,chaincodeID,'CreateReview',req.body)
   
   if (data != ""){
    return res.status(500).send({
        status: 500,
        message: "Error from CC :"+data
    });
   }

   //Inserting into mongo
   await reviewObj.save();

    return res.status(200).send({
      status: 200,
      message: "Review saved successfully with reviewID :"+id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: 500, message: error.message, data: error.data });
  }
};

module.exports.getReviews = async (req, res) => {
  try {
    console.log("######## Inside  GetReview #########");
    let { rating, serviceprovider, UserId } = req.body;
    let result;
    if (rating) {
      result = await reviewModel.find({
        rating: rating,
      });
    }
    if (serviceprovider) {
      result = await reviewModel.find({
        serviceprovider: serviceprovider,
      });
    }
    if (UserId) {
      result = await reviewModel.find({
        UserId: UserId,
      });
    }
    res.send({
      status: 200,
      message: "success",
      result,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: 500, message: error.message, data: error.data });
  }
};

module.exports.upvote = async (req, res) => {
  try {
    console.log("######## Inside  upvote #########");
    const { id } = req.params;
    const review = await reviewModel.findOne({ reviewId: id });
    // check if user has already upvoted
    if (review.upvoteBy.includes(req.user.id)) {
      throw new Error("User has already upvoted");
    }
    review.upvotes += 1;
    review.upvoteBy.push(req.user.id);
    const result = await review.save();
    res.send({
      status: 200,
      message: "success",
      result,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ status: 500, message: error.message, data: error.data });
  }
};

function makeid(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
