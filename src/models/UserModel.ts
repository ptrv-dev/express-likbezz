import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    posts: {
      type: [mongoose.Types.ObjectId],
      ref: 'Post',
      default: [],
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
