import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: true,
    },
    lastName: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      default: Date.now(),
    },
    phone: {
      type: String,
      // required: true,
      unique: true,
      match: /^[0-9]{10}$/, // Example: 10-digit phone number
    },
    role: {
      type: String,
      default: "operator",
    },
    permissions: {
      type: [String], // Array of strings to define permissions
    
      enum: ["Operator","Customer Service", "Viewer"],
      default: ["Viewer"],
    },
  },
  { timestamps: true }
);

const Operator = mongoose.model("operator", operatorSchema);
export default Operator;
