const express = require('express');
const app = express();
const db = require('./db'); // Ensure `db` initializes your MongoDB connection
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Parse JSON bodies and store them in req.body
const PORT=process.env.PORT||3000;


// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to my hotel... How can I help you...sir?');
});


//import the router files 
const personRoutes=require('./routes/personRoutes');
const menuRoutes=require('./routes/menuRoutes');

//use the routers
app.use('/person',personRoutes);
app.use('/menu',menuRoutes);


// Start the server
app.listen(PORT, () => {
  console.log('Server is active now on port 3000');
});
