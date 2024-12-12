const express = require('express');
const app = express();
const db = require('./db'); // Ensure `db` initializes your MongoDB connection
require('dotenv').config();
const passport = require('./auth');
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Parse JSON bodies and store them in req.body
const PORT = process.env.PORT || 3000;

// Middleware Function
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Request made to: ${req.originalUrl}`);
  next(); // move on to the next phase
};

app.use(logRequest);

app.use(passport.initialize());


const localmiddleware = passport.authenticate('local', { session: false });
app.get('/', (req, res) => {
  res.send('Welcome to my hotel... How can I help you...sir?');
});


//import the router files 
const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');
const Person = require('./models/person');

//use the routers
app.use('/person', localmiddleware, personRoutes);
app.use('/menu', menuRoutes);

// Start the server
app.listen(PORT, () => {
  console.log('Server is active now on port 3000');
});
