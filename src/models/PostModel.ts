import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likes: {
      type: Map,
      of: Boolean,
      default: {},
    },
    dislikes: {
      type: Map,
      of: Boolean,
      default: {},
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: {
      type: [mongoose.Types.ObjectId],
      ref: 'Comment',
      default: [],
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
