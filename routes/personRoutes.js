const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require('./../jwt');

const Person = require('./../models/person');
const req = require('express/lib/request');
// POST route to add a person
router.post('/signup', async (req, res) => {
    try {
        const data = req.body; // Get the person data from the request body

        // Create a new Person document using the MongoDB model
        const newPerson = new Person(data);

        // Save the new person to the database
        const response = await newPerson.save();
        console.log('Data saved successfully');

        const payload = {
            id: response.id,
            username: response.username
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : ", token);

        res.status(200).json({ response: response, token: token });
    } catch (error) {
        console.error(error); // Use `console.error` for errors
        res.status(500).json({ error: 'Internal server error' });
    }
})

//Login Route
router.post('/login', async (req, res) => {
    try {
        //extract username and password from the req.body data
        const { username, password } = req.body

        //find the user by username and password
        const user = await Person.findOne({ username: username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid Username or Password' });
        }
        const payload = {
            id: user.id,
            username: user.username
        }
        //generate token from payload
        const token = generateToken(payload);
        res.json({ token });

    } catch (error) {
        console.error(error); // Use `console.error` for errors
        res.status(500).json({ error: 'Internal server error' });
    }

})
// GET method to get the person 
router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await Person.find();
        console.log('data succesfully feched');
        res.status(200).json(data);
    } catch (error) {
        console.error(error); // Use `console.error` for errors
        res.status(500).json({ error: 'Internal server error' });
    }
})


//Get the profile of a person
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        console.log("userData: ", userData);

        const userId = userData.id;
        const user = await Person.findById(userId);

        res.status(200).json({ user });
    } catch (error){
        console.error('Error fetching persons:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType.toLowerCase(); // Optional: Normalize case
        const validWorkTypes = ['chef', 'manager', 'waiter'];

        if (validWorkTypes.includes(workType)) {
            const persons = await Person.find({ work: workType });

            if (persons.length > 0) {
                res.status(200).json(persons);
            } else {
                res.status(404).json({ error: 'No persons found for the specified work type' });
            }
        } else {
            res.status(400).json({ error: 'Invalid work type' });
        }
    } catch (error) {
        console.error('Error fetching persons:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const updatedPersonData = req.body;
        const updatedPerson = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        });
        if (!updatedPerson) {
            return res.status(404).json({ error: 'Person Not Found' });
        }
        // Send the updated person data as a JSON response
        console.log('data updated succesfully');
        res.json(updatedPerson);
    }
    catch (error) {
        console.error(error); // Use `console.error` for errors
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const deletedPerson = await Person.findByIdAndDelete(personId);
        if (!deletedPerson) {
            return res.status(404).json({ error: 'Person not found' });
        }
        // Send a success message as a JSON response
        console.log('Person data deleted sucessfully');
        res.status(308).json({ message: 'Person deleted successfully' });

    } catch (error) {
        console.error(error); // Use `console.error` for errors
        res.status(500).json({ error: 'Internal server error' });
    }
})
module.exports = router;