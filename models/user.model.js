const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    useremail: {
        type: String,
        required: true,
        unique: true
    },
    userpassword: {
        type: String,
        required: false
    },
    userAutcode: {
        type: String,
        required: false,
        default:"loading"
    },
    userRefeshtoken:  {
        type: String,
        required: false,
        default:"loading"
    },
    Usertokenduration: {
        type: String,
        required: false,
        default:"loading"
    },
});

// Pre-save middleware to hash the password
userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('userpassword')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.userpassword, salt);
        this.userpassword = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
