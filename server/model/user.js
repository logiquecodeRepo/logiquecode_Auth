const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    serverUrl: {
        type: String,
        required: true
    },
    roles: {
        type: [String], // Array of strings
        required: true
    }
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    number: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    projects: {
        type: [ProjectSchema], // Array of embedded ProjectSchema
        default: []
    }
});

module.exports = mongoose.model('sso_login', UserSchema);
