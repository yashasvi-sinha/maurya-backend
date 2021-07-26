const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Field cannot be left empty']
    },
    photo: {
        type: String,
        required: [true, 'Field cannot be left empty']
    },
    location: {
        type: String,
        required: [true, 'Field cannot be left empty']
    },
    background: {
        type: String,
        required: [true, 'Field cannot be left empty']
    },
    companyName: {
        type: String,
        required: [true, 'Field cannot be left empty']
    }
});

const Placement = mongoose.model('placements', placementSchema);
module.exports = Placement;