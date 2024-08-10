import mongoose from "mongoose";
import addressSchema from "../general/address.model.js";

const orderDetailsSchema = new mongoose.Schema({
  medicineRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  
    required: true
  },
  orderStatus: {
    type: String,
    enum: ["placed", "confirmed", "cancelled", "packed", "shipped", "delivered", "returned"],
    default: "placed"
  },
  contactInfo: {
    type: String,
    required: true
  },
  shippingAddress: {
    type: addressSchema,
    required: true
  }
}, { timestamps: true });

export default orderDetailsSchema;
