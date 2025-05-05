import mongoose from "mongoose";

const songSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    length: {
        type: Number
    },
    cover: {
        type: String
    }
}, {
    timestamps: true
});

const Song = mongoose.model("Song", songSchema);

export default Song;