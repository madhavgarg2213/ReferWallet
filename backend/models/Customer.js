const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  referId: {
    type: String,
    unique: true,
    uppercase: true
  },
  contactNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  walletBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate ReferID before saving
customerSchema.pre('save', function(next) {
  if (this.isNew) {
    const firstLetter = this.firstName.charAt(0).toUpperCase();
    const lastLetter = this.lastName.charAt(0).toUpperCase();
    const lastThreeDigits = this.contactNumber.slice(-3);
    this.referId = `SS${firstLetter}${lastLetter}${lastThreeDigits}`;
  }
  next();
});

module.exports = mongoose.model('Customer', customerSchema);
