import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String, 
        required: true,
    },
    location : {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: "no photo"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments:[{
        comment: {
            type: String
        },
        postedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

},
{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;