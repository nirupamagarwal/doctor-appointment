import mongoose from "mongoose";
import addressSchema from "../general/address.model.js";

export const doctorBookingSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientAddress: { type: addressSchema, 
        // required: true
     },
    disease: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    },
    doctorResponse: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    operatorResponse: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const DoctorBooking = mongoose.model("doctorBooking", doctorBookingSchema);
export default DoctorBooking;
