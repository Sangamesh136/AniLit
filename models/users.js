const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const { post } = require('../routes');
require("dotenv").config();
mongoose
  .connect(process.env.MONGODB_URL)
  .then(()=>console.log("Database connected"))
  .catch((err)=>console.log(err));

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  contact: Number,
  boards: {
    type: Array,
    default:[]
  },
  posts:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ]
})

userSchema.plugin(plm);

module.exports= mongoose.model("user",userSchema);