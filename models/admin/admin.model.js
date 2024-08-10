const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/, // Example: 10-digit phone number
  },
  role: {
    type: String,
    required: true,
    // enum: ['superadmin', 'admin', 'editor'], // Example roles
    // default: 'admin',
  },
  permissions: {
    type: [String], // Array of strings to define permissions
    required: true,
    enum: ['Administrator', 'Operator', 'Viewer'],
    default:[Viewer],
  },
 
},
{ timestamps: true },
);

module.exports = mongoose.model('Admin', adminSchema);
