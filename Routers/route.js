const express = require("express"),
  route = new express.Router(),
  reviewController = require("../Controller/reviews"),
  userController = require("../Controller/users");

route.post("/user/createReview", reviewController.createReview);
route.post("/user/getReview", reviewController.getReviews);
route.get("/user/getAllReview", reviewController.getAllReviews);
route.get("/user/upvote/:id", reviewController.upvote);
route.post("/user/signup", userController.signup);
route.post("/user/signin", userController.signin);
route.get("/user/singout", userController.signout);
route.get("/user/getUser/:id", userController.getUser);

module.exports = route;
