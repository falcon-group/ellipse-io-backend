const mongoose = require('mongoose');
const schema = mongoose.Schema({
    sessionId: {
        type: String,
        index: true,
        required: [true, 'SessionId is required']
    },
    userCustomId: {
        type: String,
        index: true,
        required: [true, 'Reference to user custom id is obligatory'],
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    createDate: {
        type: Date,
        required: [true, 'Creation date is Required']
    },
});
module.exports = mongoose.model('Log', schema);