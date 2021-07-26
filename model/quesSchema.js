const mongoose = require ('mongoose');

const quesSchema = new mongoose.Schema({
    day: String,
    picPath: String,
});

const quesModel = mongoose.model('questions', quesSchema);
module.exports = quesModel