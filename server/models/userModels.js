import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique:true },
//   username: String,
//   password: { type: String, required: true },
//   sketchs: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }],
//   avatar: { type: String, default: "https://res.cloudinary.com/dhaezmblt/image/upload/v1683021517/user_avatar/placeholder_fc6szz.png" }
//   // ,avatar_public_id: { type: String , default: "Default_Avatar"}

// }, { timestamps: true });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique:true },
  username: String,
  password: { type: String, required: true },
  info: String,
  sketchs: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  avatar: { type: String, default: "https://res.cloudinary.com/dhaezmblt/image/upload/v1716493293/avatar-3814049_640_ykc5lj.png" }
  // ,avatar_public_id: { type: String , default: "Default_Avatar"}

}, { timestamps: true });

const UserModel = mongoose.model("user", userSchema);

export default UserModel