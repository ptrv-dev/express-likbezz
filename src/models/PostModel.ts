import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    image: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
    likes: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
    dislikes: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
