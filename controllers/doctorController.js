import Doctor from "../models/doctor/doctors.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

// Function to hash the password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// Function to check if a doctor already exists
const checkDoctorExists = async (email) => {
  return await Doctor.findOne({ email });
};

export const registerDoctor = async (req, res, next) => {
  const { password, email, ...rest } = req.body;

  try {
    // Check if the doctor already exists
    const existingDoctor = await checkDoctorExists(email);
    if (existingDoctor) {
      return next(
        errorHandler(400, "Doctor with this email Id already exists")
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new doctor instance
    const newDoctor = new Doctor({
      ...rest,
      email,
      password: hashedPassword,
    });

    // Save the doctor to the database
    await newDoctor.save();
    const token = jwt.sign({ id: newDoctor._id }, process.env.JWT_SECRET);
    res.status(201).json({
      message: "Doctor registered successfully",
      doctor: newDoctor,
      token
    });
  } catch (error) {
    // Error handling for unexpected issues
    next(error);
  }
};

export const loginDoctor = async (req, res, next) => {
  const { email, password, contactNumber } = req.body;
  try {
    // Check if the doctor exists
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { contactNumber }],
    });
    if (!existingDoctor) {
      return next(errorHandler(400, "Invalid email or contact number"));
    }
    // Check if the password is correct
    const isValidPassword = bcrypt.compareSync(
      password,
      existingDoctor.password
    );
    if (!isValidPassword) return next(errorHandler(400, "Invalid Credentials"));
    // Generate a JWT token
    const token = jwt.sign({ id: existingDoctor._id }, process.env.JWT_SECRET);

    res.status(200).json({
      existingDoctor,
      token,
    });
  } catch (error) {
    next(error);
  }
};
export const profileInfo = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) return next(errorHandler(404, "Doctor not found"));
    res.status(200).json(doctor);

  } catch (error) {
    next(error);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.status(200).json(doctor);


  } catch (error) {
    next(error);
  }
};
