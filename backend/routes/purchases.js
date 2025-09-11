const express = require('express');
const Purchase = require('../models/Purchase');
const Customer = require('../models/Customer');
const router = express.Router();

// Get all purchases
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('customerId', 'name referId contactNumber')
      .sort({ purchaseDate: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Wallet Deduction and Create Purchase Record
router.post('/', async (req, res) => {
  try {
    const { referId, amount, walletUsed = 0 } = req.body;

    if (!referId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid ReferID and amount are required' });
    }

    // Find customer by ReferID
    const customer = await Customer.findOne({ referId: referId.toUpperCase() });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found with this ReferID' });
    }

    // Validate walletUsed
    const walletToUse = Math.min(walletUsed, customer.walletBalance, amount);

    // Deduct walletUsed from walletBalance
    customer.walletBalance -= walletToUse;

    // Calculate 2% wallet credit on full amount (or you can use amount-walletToUse if you want)
    const walletCredit = Math.round((amount * 0.02) * 100) / 100;

    // Add wallet credit
    customer.walletBalance += walletCredit;

    // Create purchase record
    const purchase = new Purchase({
      customerId: customer._id,
      referId: referId.toUpperCase(),
      amount,
      walletCredit,
      walletUsed: walletToUse // <-- Save walletUsed
    });

    // Save both purchase and customer updates
    await Promise.all([purchase.save(), customer.save()]);

    // Return purchase with customer details
    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('customerId', 'name referId contactNumber walletBalance');

    res.status(201).json(populatedPurchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new purchase
router.post('/', async (req, res) => {
  try {
    const { referId, amount } = req.body;
    
    if (!referId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid ReferID and amount are required' });
    }

    // Find customer by ReferID
    const customer = await Customer.findOne({ referId: referId.toUpperCase() });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found with this ReferID' });
    }

    // Calculate 2% wallet credit
    const walletCredit = Math.round((amount * 0.02) * 100) / 100; // Round to 2 decimal places

    // Create purchase record
    const purchase = new Purchase({
      customerId: customer._id,
      referId: referId.toUpperCase(),
      amount,
      walletCredit
    });

    // Update customer wallet balance
    customer.walletBalance += walletCredit;

    // Save both purchase and customer updates
    await Promise.all([purchase.save(), customer.save()]);

    // Return purchase with customer details
    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('customerId', 'name referId contactNumber walletBalance');

    res.status(201).json(populatedPurchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all purchases
router.delete('/clear/all', async (req, res) => {
  try {
    await Purchase.deleteMany({});
    res.json({ message: 'All purchases deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get purchases by customer ReferID
router.get('/customer/:referId', async (req, res) => {
  try {
    const customer = await Customer.findOne({ referId: req.params.referId.toUpperCase() });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const purchases = await Purchase.find({ customerId: customer._id })
      .sort({ purchaseDate: -1 });
    
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
