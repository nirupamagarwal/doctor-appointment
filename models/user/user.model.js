import mongoose from "mongoose";
import addressSchema from "../general/address.model.js";
import orderDetailsSchema from "./order.model.js";
import { doctorBookingSchema } from "../appointment/doctorAppointment.model.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: function () {
        return this.authProvider === "google";
      },
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      required: function () {
        return this.authProvider === "facebook";
      },
      unique: true,
      sparse: true,
    },
    firstName: {
      type: String,
      required: function () {
        return this.authProvider !== "phone";
      },
    },
    lastName: {
      type: String,
      required: function () {
        return this.authProvider !== "phone";
      },
    },
    imageUrl: String,
    phoneNumber: {
      type: String,
      required: function () {
        return this.authProvider === "phone";
      },
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      required: true,
      enum: ["google", "facebook", "phone"],
    },
    role: {
      type: String,
      enum: ["user", "doctor", "admin", "vendor", "operator"],
      default: "user",
    },
    address: addressSchema, // Embedded document
    medicineOrdered: [orderDetailsSchema],
    appointmentBooked: [doctorBookingSchema],
    userHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "medicalHistory" }], // Referencing medicalHistory documents
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
export default User;
