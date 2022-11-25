import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: 'Post',
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
  },
  { timestamps: true }
);

const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel;
