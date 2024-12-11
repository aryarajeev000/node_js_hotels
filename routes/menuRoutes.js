const express = require('express');
const router = express.Router();

const MenuItem = require('./../models/Menuitems');
const Person = require('../models/person');

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
});

router.get('/', async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log('data succesfully feched');
    res.status(200).json(data);
  } catch (error) {
    console.error(error); // Use `console.error` for errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const menuId = req.params.id;
    const updatedMenuData = req.body;
    const updatedMenu = await MenuItem.findByIdAndUpdate(menuId, updatedMenuData, {
      new: true,
      runValidators: true,
    });
    if (!updatedMenu) {
      return res.status(404).json({ error: 'Menu Item Not Found' });
    }
    console.log('Menu updated sucessfully');
    res.status(200).json(updatedMenu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const menuId = req.params.id;
    const deletedMenuData = await MenuItem.findByIdAndDelete(menuId);
    if (!deletedMenuData) {
      return res.status(404).json({ error: 'Menu items Not found' });
    }
    console.log('Menu data deleted sucessfully');
    res.status(308).json({ message: 'Menu data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

})
module.exports = router;