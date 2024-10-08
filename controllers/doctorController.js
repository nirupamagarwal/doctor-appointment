import Doctor from "../models/doctor/practitioner.model.js";
import WebSocket, { WebSocketServer } from "ws";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Function to hash the password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt for hashing
    return await bcrypt.hash(password, salt); // Hash the password with the salt
  } catch (error) {
    throw new Error("Error hashing password"); // Handle any error that occurs during hashing
  }
};

// Function to check if a doctor with the provided email already exists
const checkDoctorExists = async (email) => {
  return await Doctor.findOne({ email }); // Find a doctor by email
};

// Controller function to handle doctor registration
export const registerDoctor = async (req, res, next) => {
  const { password, email, ...rest } = req.body;

  try {
    // Check if the doctor already exists in the database
    const existingDoctor = await checkDoctorExists(email);
    if (existingDoctor) {
      return next(
        errorHandler(400, "Doctor with this email Id already exists") // Return an error if the doctor already exists
      );
    }

    // Hash the doctor's password
    const hashedPassword = await hashPassword(password);

    // Create a new doctor instance with the hashed password and other details
    const newDoctor = new Doctor({
      ...rest,
      email,
      password: hashedPassword,
    });

    // Save the new doctor to the database
    await newDoctor.save();

    // Generate a JWT token for the newly registered doctor
    const token = jwt.sign({ id: newDoctor._id }, process.env.JWT_SECRET);

    // Send a success response with the doctor details and token
    res.status(201).json({
      message: "Doctor registered successfully",
      doctor: newDoctor,
      token,
    });
  } catch (error) {
    // Error handling for unexpected issues
    next(error);
  }
};

// Controller function to handle doctor login
export const loginDoctor = async (req, res, next) => {
  const { email, password, contactNumber } = req.body;

  try {
    // Check if the doctor exists by either email or contact number
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { contactNumber }],
    });

    if (!existingDoctor) {
      return next(errorHandler(400, "Invalid email or contact number")); // Return an error if the doctor is not found
    }

    // Compare the provided password with the stored hashed password
    const isValidPassword = bcrypt.compareSync(
      password,
      existingDoctor.password
    );

    if (!isValidPassword) {
      return next(errorHandler(400, "Invalid Credentials")); // Return an error if the password is incorrect
    }

    // Generate a JWT token for the logged-in doctor
    const token = jwt.sign({ id: existingDoctor._id }, process.env.JWT_SECRET);

    // Send a success response with the doctor details and token
    res.status(200).json({
      existingDoctor,
      token,
    });
  } catch (error) {
    next(error); // Error handling for unexpected issues
  }
};

// Controller function to get the logged-in doctor's profile information
export const profileInfo = async (req, res, next) => {
  try {
    // Find the doctor by ID from the JWT token
    const doctor = await Doctor.findById(req.user.id);

    if (!doctor) {
      return next(errorHandler(404, "Doctor not found")); // Return an error if the doctor is not found
    }

    // Send the doctor's profile information as a response
    res.status(200).json(doctor);
  } catch (error) {
    next(error); // Error handling for unexpected issues
  }
};

// Controller function to update the logged-in doctor's profile
export const updateProfile = async (req, res, next) => {
  try {
    // Find the doctor by ID and update their profile with the provided data
    const doctor = await Doctor.findByIdAndUpdate(req.user.id, req.body, {
      new: true, // Return the updated document
    });

    // Send the updated doctor profile as a response
    res.status(200).json(doctor);
  } catch (error) {
    next(error); // Error handling for unexpected issues
  }
};

const wss = new WebSocketServer({ port: 8080 });
const doctorConnections = new Map(); // Use a Map to store connections

export const toggleDoctorActiveStatus = async (req, res, next) => {
  const doctorId = req.user.id;
  try {
    wss.on("connection", (ws, req) => {
      // Assuming doctorId is sent as a query parameter or in some other way

      if (doctorId) {
        // Store the connection with the doctorId as the key
        console.log(ws)
        doctorConnections.set(doctorId, ws);
        console.log(`Doctor ${doctorId} connected`);
      }

      ws.on("close", () => {
        // Remove the connection when the doctor disconnects
        doctorConnections.delete(doctorId);
        console.log(`Doctor ${doctorId} disconnected`);
      });
    });
    res.status(200).json(doctorConnections.get(doctorId));
  } catch (error) {
    next(error);
  }
};

export const visitRequest = async (req, res, next) => {
  const userId = req.user.id;
  const { doctorId, geoLocation, disease, fees } = req.body;
  try {
  } catch (error) {}
};

// https://chatgpt.com/share/8f431943-9cd2-41f3-85a5-141bb174c51b
 