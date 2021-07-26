const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
    sessionLink: {
        type: String,
        required: [true, 'Field cannot be left empty'],
        trim: true
    },
    expireAt: {
        type: Date,
        default: Date.now() + 2 * 60 * 60 * 1000,
    }
},
{ timestamps: true},

);
sessionSchema.index({"expireAt": 1}, { expireAfterSeconds: 0})

const Session = mongoose.model('sessions', sessionSchema);
module.exports = Session;