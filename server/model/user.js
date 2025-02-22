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
    },
    userType: {
        type: String,
    },
    status: {
        type: String,
    },
    registrationNumber: {
        type: String,
    },
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pinCode: {
        type: Number,
    },
    panNumber: {
        type: String,
    },
    tanNumber: {
        type: String,
    },
    gstNumber: {
        type: String,
    },
    uploadDocument: {
        type: Buffer,
    },
    gender: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
    }
});

// TTL index on expiresAt field
ProjectSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('sso_login', UserSchema);
