import mongoose from "mongoose";
import addressSchema from "../general/address.model.js";


const doctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    activeStatus: {
      type: Boolean,
      default: false,
    },
    degree: {
      type: String,
      required: true,
    },
    certificateURL: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    languagesSpoken: {
      type: [String],
      default: ["Hindi"],
    },
    address: {
      type: addressSchema,
      required: true,
    },
    serviceArea: {
      type: String,
      required: true,
    },
    gpsCoordinates: {
      type: {
        lat: {
          type: Number,
        },
        long: {
          type: Number,
        },
      },
    },
    passingYear: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    role: {
      type: String,
      required: true,
      enum: ["nurse", "doctor", "physiotherapist", "pathalogist"],
    },
    reviews: [
      {
        patientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Patient",
        },
        review: String,
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor
