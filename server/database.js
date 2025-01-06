const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
});

mongoose.connection.on('error', (err) => {
    console.error('Error during DB connection:', err);
});

mongoose.connection.once('open', () => {
    console.log('DB connected successfully!');
});

module.exports = mongoose;
