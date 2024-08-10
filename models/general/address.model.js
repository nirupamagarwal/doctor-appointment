import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  
  pincode: {
    type: Number,
    required: true
  },
  streetAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: "India"
  },
  landmark: {
    type: String,
    default: ""
  },
  addressType: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
  default:"Home"
  },
  isDefault: {
    type: Boolean,
    default: true
  }
}, { timestamps: true ,_id:false});

export default addressSchema;
