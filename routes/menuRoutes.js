const express=require('express');
const router=express.Router();

const MenuItem = require('./../models/Menuitems');

router.post('/', async (req, res) => {
    try {
      const data = req.body;
      const newMenu = new MenuItem(data);
      const response = await newMenu.save();
      console.log('Data saved successfully');
      res.status(200).json(response);
    } catch (error) {
      console.error(error); // Use `console.error` for errors
      res.status(500).json({ error: 'Internal server error' });
    }
  })
  
router.get('/', async (req, res) => {
    try {
        const data = await MenuItem.find();
        console.log('data succesfully feched');
        res.status(200).json(data);
    } catch (error) {
        console.error(error); // Use `console.error` for errors
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports=router;