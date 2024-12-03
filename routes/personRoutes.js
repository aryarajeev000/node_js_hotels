const express = require('express');
const router = express.Router();

const Person = require('./../models/person');
// POST route to add a person
router.post('/', async (req, res) => {
    try {
        const data = req.body; // Get the person data from the request body

        // Create a new Person document using the MongoDB model
        const newPerson = new Person(data);

        // Save the new person to the database
        const response = await newPerson.save();
        console.log('Data saved successfully');
        res.status(200).json(response);
    } catch (error) {
        console.error(error); // Use `console.error` for errors
        res.status(500).json({ error: 'Internal server error' });
    }
})

// GET method to get the person 
router.get('/', async (req, res) => {
    try {
        const data = await Person.find();
        console.log('data succesfully feched');
        res.status(200).json(data);
    } catch (error) {
        console.error(error); // Use `console.error` for errors
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

module.exports = router;