import mongoose from "mongoose";

const vendorProductSchema = new mongoose.Schema({
  medicineRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  vendorRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  stockQuantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
},{ _id: false });

export default vendorProductSchema;
