import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    posts: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
