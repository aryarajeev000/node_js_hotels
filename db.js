const mongoose = require('mongoose');
require('dotenv').config();
// Define the MongoDB connection URL
//const mongoURL = process.env.MONGODB_URL_LOCAL; // Replace "hotels" with any database name you want
const mongoURL = process.env.MONGODB_URL;
// Set up MongoDB connection
mongoose.set('strictQuery', false); // Optional: Suppress deprecation warnings
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Define event listeners for database connection
db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (error) => {
    console.error('MongoDB server connection error:', error);
});

db.on('disconnected', () => {
    console.log('Disconnected from MongoDB server');
});

// Handle process termination gracefully
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});

module.exports = db;
