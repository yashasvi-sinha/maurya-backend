const mongoose = require('mongoose');
const announcementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'This field cannot be left empty']
    },
    designation: {
        type: String,
        required: [true, 'This field cannot be left empty']
    },
    createdAt: {
        type: String,
        default: Date,
        required: true
        
    },
    announcement: {
        type: String,
        required: [true, 'This field cant be left empty!'],
        trim: true
    }
});

const Announce = mongoose.model('announcement', announcementSchema);
module.exports = Announce;