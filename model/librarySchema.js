const mongoose = require('mongoose');
const librarySchema = new mongoose.Schema({
    videoLink: {
        type: String,
        required: true,
        trim: true,
    },
    videoTitle: {
        type: String,
        required: true,
        trim: true,
    },
    videoSub_Title: {
        type: String,
        required: true,
        trim: true
    }
},
{ timestamps: true}
)

const Library = mongoose.model('videoLibrary', librarySchema);
module.exports = Library;