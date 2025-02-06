import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// User Schema
const userSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
    },
    discordId: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    linkedInId: {
      type: String,
      default: null,
    },
    twoFactorActivated: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: null,
      maxlength: [72, "Password too long"], // bcrypt max length
    },
    verifyCode: {
      type: String,
      default: null,
      maxlength: [32, "Verify code too long"],
    },
    verifyCodeExpiry: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          return !v || v > new Date();
        },
        message: "Verify code expiry must be a future date",
      },
    },
    accounts: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Account",
        },
      ],
    },
    eventsRegistered: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tournament",
      },
    ],
    tournaments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tournament",
      },
    ],
    brackets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bracket",
      },
    ],
    games: [
      {
        type: Schema.Types.ObjectId,
        ref: "Games",
      },
    ],
  },
  {
    timestamps: true,
  },
);
// Cascade delete accounts when a user is deleted
userSchema.pre("remove", async function (next) {
  await mongoose.model("Account").deleteMany({ userId: this._id });
  next();
});

// Create Model
const UserModel = models.UserModel || model("UserModel", userSchema);

// module.exports = UserModel;

export { UserModel }
