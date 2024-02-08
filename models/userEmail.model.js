const mongoose = require('mongoose');

const userEmailSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    emailid: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    Date: {
        type: String,
        required: true
    }
});

const UserEmail = mongoose.model('UserEmail', userEmailSchema);

module.exports = UserEmail;
