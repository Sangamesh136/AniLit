var express = require("express");
var router = express.Router();
const userModel = require("../models/users");
const postModel = require("../models/post");
const passport = require("passport");
const localStrategy = require("passport-local");
const uploadPic = require("./multer");

const {
  login,
  home,
  fileUpload,
  register,
  profile,
  feed,
  showPosts,
  add,
  logout,
  loginPost,
  registerPost,
  createpost,
} = require("../controllers/index");

passport.use(new localStrategy(userModel.authenticate()));

router
  .get("/login", login)
  .get("/", home)
  .get("/register", register)
  .get("/profile", isLoggedIn, profile)
  .get("/feed", isLoggedIn, feed)
  .get("/show/posts", isLoggedIn, showPosts)
  .get("/add", isLoggedIn, add)
  .get("/logout", logout);

router
  .post("/fileUpload", isLoggedIn, uploadPic.single("image"), fileUpload)
  .post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/",
      successRedirect: "/profile",
    }),
    loginPost
  )
  .post("/register", registerPost)
  .post("/createpost", isLoggedIn, uploadPic.single("postimage"), createpost);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
