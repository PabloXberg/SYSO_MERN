import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: String,
  password: { type: String, required: true },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "pet" }],
  sketchs: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }]
}, { timestamps: true });

const UserModel = mongoose.model("user", userSchema);

export default UserModel