import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, trim: true },
    password: { type: String, required: true },
    info: String,
    sketchs: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "sketche" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dhaezmblt/image/upload/v1716493293/avatar-3814049_640_ykc5lj.png",
    },

    // Admin role — required to create/edit Battles. Default false; set manually in DB
    // for your account: db.users.updateOne({email:"you@..."},{$set:{isAdmin:true}})
    isAdmin: { type: Boolean, default: false },

    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.index({ createdAt: -1 });
userSchema.index({ resetPasswordToken: 1 });

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
