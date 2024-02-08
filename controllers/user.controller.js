const bcrypt = require('bcrypt');
const User = require('../models/user.model');

// Signup user
exports.signupUser = async (req, res) => {
    try {
        const { useremail} = req.body;
        const existingUser = await User.findOne({ useremail });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const user = new User(req.body);
        const NewUser = await  user.save();
        res.status(201).json(NewUser._id);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
function isValidEmail(email) {
    // Regular expression for validating email addresses
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

exports.loginUser = async (req, res) => {
    try {
        const { useremail} = req.body;
        const user = await User.findOne({ useremail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (isValidEmail(user.useremail)) {   
            const isMatch = await bcrypt.compare(req.body.userpassword, user.userpassword);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            // Handle successful login
            res.status(201).json(user._id);
        }else{
            res.status(201).json(user._id);
        }
       
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Find one user by id
exports.findOneUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update one user by id
exports.updateOneUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.username = req.body.username || user.username;
        user.useremail = req.body.useremail || user.useremail;
        user.userpassword = req.body.userpassword || user.userpassword;
        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete one user by id
exports.deleteOneUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
