const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: [true, 'UserId 未填寫']
        },
        image: {
            type: String,
            default: ""
        },
        content: {
            type: String,
            required: [true, 'Content 未填寫'],
        },
        createAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    }
  );
  
  const Post = mongoose.model(
    'Post',
    postSchema
  );

  module.exports = Post;