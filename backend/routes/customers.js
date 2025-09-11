const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer by ReferID
router.get('/refer/:referId', async (req, res) => {
  try {
    const customer = await Customer.findOne({ referId: req.params.referId.toUpperCase() });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const { name, contactNumber } = req.body;
    
    if (!name || !contactNumber) {
      return res.status(400).json({ message: 'Name and contact number are required' });
    }

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    if (nameParts.length < 2) {
      return res.status(400).json({ message: 'Please provide both first and last name' });
    }

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    // Check if contact number already exists
    const existingCustomer = await Customer.findOne({ contactNumber });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this contact number already exists' });
    }

    const customer = new Customer({
      name,
      firstName,
      lastName,
      contactNumber
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Customer with this ReferID already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Delete customer by ID
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update customer wallet balance
router.patch('/:id/wallet', async (req, res) => {
  try {
    const { amount } = req.body;
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.walletBalance += amount;
    await customer.save();
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
