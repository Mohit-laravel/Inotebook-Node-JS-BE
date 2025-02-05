const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email address"
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('user', userSchema);
User.createIndexes();

module.exports = User;
