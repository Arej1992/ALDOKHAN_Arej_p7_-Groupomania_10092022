const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: { type: String, required: true },
    image: { type: String, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true },
  },
  { timestamps: true } //for Time
);

const Post = mongoose.model("post", postSchema);

module.exports = Post;
