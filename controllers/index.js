const userModel = require("../models/users");
const postModel = require("../models/post");
const passport = require("passport");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
const login = (req, res, next) => {
  res.render("login", { nav: false });
};

const home = (req, res) => {
  res.render("home", { nav: false });
};

const fileUpload = async (req, res, next) => {
  // const user = await userModel.findOne({ username: req.session.passport.user });
  // user.profileImage = req.file.filename;
  // await user.save();
  // res.redirect("/profile");
  const user = await userModel.findOne({
    username: req.session.passport.user,
});
const image = req.file.filename;
const filePath = path.join(__dirname, "../public/images/uploads/" + image);
cloudinary.uploader.upload(filePath, function (error, result) {
    if (error) {
        console.log("Error:", error);
        res.redirect("/profile");
    } else {
        fs.unlinkSync(filePath);
        if (user.publicId !== null) {
            const id = user.publicId;
            cloudinary.uploader.destroy(id, function (error, result) {});
        }
        user.publicId = result.public_id;
        user.profileImage = result.url;
        user.save();
        res.redirect("/profile");
    }
});
};

const register = (req, res) => {
  res.render("register", { nav: false });
};

const profile = async (req, res) => {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");
  res.render("profile", { user, nav: true });
};

const feed = async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const posts = await postModel.find().populate("user");
  res.render("feed", { user, posts, nav: true });
};

const showPosts = async (req, res) => {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");
  res.render("show", { user, nav: true });
};

const add = async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("add", { user, nav: true });
};

const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

const loginPost = (req, res, next) => {};

const registerPost = (req, res) => {
  const data = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
    name: req.body.fullname,
  });
  userModel.register(data, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
};
const createpost = async (req, res) => {
  // const user = await userModel.findOne({
  //   username: req.session.passport.user,
  // });
  // const post = await postModel.create({
  //   user: user._id,
  //   title: req.body.title,
  //   description: req.body.description,
  //   image: req.file.filename,
  // });
  // user.posts.push(post._id);
  // await user.save();
  // res.redirect("/profile");
  const user = await userModel.findOne({
    username: req.session.passport.user,
});

const image = req.file.filename;
const filePath = path.join(__dirname, "../public/images/uploads/" + image);
cloudinary.uploader.upload(filePath, async function (error, result) {
    if (error) {
        console.log("Error:", error);
        res.redirect("/profile");
    } else {
        fs.unlinkSync(filePath);
        const post = await postModel.create({
            user: user._id,
            title: req.body.title,
            descreption: req.body.descreption,
            image: result.url,
            publicId: result.public_id,
        });
        user.posts.push(post._id);
        await user.save();
        await post.save();
        res.redirect("/profile");
    }
});
};

module.exports = {
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
};
