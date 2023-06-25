import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique:true },
  username: String,
  password: { type: String, required: true },
  info: String,
  sketchs: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  avatar: { type: String, default: "https://res.cloudinary.com/dhaezmblt/image/upload/v1684921855/user_avatar/user-default_rhbk4i.png" }
  // ,avatar_public_id: { type: String , default: "Default_Avatar"}

}, { timestamps: true });

const UserModel = mongoose.model("user", userSchema);

export default UserModel