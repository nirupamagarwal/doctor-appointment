

import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Operator from "../models/operator/operator.model.js";
import { sendMessage } from "../index.js";

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
const checkOperatorExists = async (email) => {
  return await Operator.findOne({ email }); // Find a doctor by email
};

// Controller function to handle doctor registration
export const registerOperator = async (req, res, next) => {
  const { password, email, ...rest } = req.body;

  try {
    // Check if the doctor already exists in the database
    const existingOperator = await checkOperatorExists(email);
    if (existingOperator) {
      return next(
        errorHandler(400, "operator with this email Id already exists") // Return an error if the doctor already exists
      );
    }

    // Hash the doctor's password
    const hashedPassword = await hashPassword(password);

    // Create a new doctor instance with the hashed password and other details
    const newOperator = new Operator({
      ...rest,
      email,
      password: hashedPassword,
    });

    // Save the new doctor to the database
    await newOperator.save();

    // Generate a JWT token for the newly registered doctor
    const token = jwt.sign({ id: newOperator._id }, process.env.JWT_SECRET);

    // Send a success response with the doctor details and token
    res.status(201).json({
      message: "Operator registered successfully",
      operator: newOperator,
      token,
    });
  } catch (error) {
    // Error handling for unexpected issues
    next(error);
  }
};

// Controller function to handle doctor login
export const loginOperator = async (req, res, next) => {
  const { email, password, contactNumber } = req.body;

  try {
    // Check if the doctor exists by either email or contact number
    const existingOperator = await Operator.findOne({
      $or: [{ email }, { contactNumber }],
    });

    if (!existingOperator) {
      return next(errorHandler(400, "Invalid email or contact number")); // Return an error if the doctor is not found
    }

    // Compare the provided password with the stored hashed password
    const isValidPassword = bcrypt.compareSync(
      password,
      existingOperator.password
    );

    if (!isValidPassword) {
      return next(errorHandler(400, "Invalid Credentials")); // Return an error if the password is incorrect
    }

    // Generate a JWT token for the logged-in doctor
    const token = jwt.sign({ id: existingOperator._id }, process.env.JWT_SECRET);

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
    const operator = await Operator.findById(req.user.id);

    if (!operator) {
      return next(errorHandler(404, "operator not found")); // Return an error if the doctor is not found
    }

    // Send the doctor's profile information as a response
    res.status(200).json(operator);
  } catch (error) {
    next(error); // Error handling for unexpected issues
  }
};

// Controller function to update the logged-in doctor's profile
export const updateProfile = async (req, res, next) => {
  try {
    // Find the doctor by ID and update their profile with the provided data
    const operator = await Operator.findByIdAndUpdate(req.user.id, req.body, {
      new: true, // Return the updated document
    });

    // Send the updated doctor profile as a response
    res.status(200).json(operator);
  } catch (error) {
    next(error); // Error handling for unexpected issues
  }
};


export const responseToBookingRequest=async(req,res,next)=>{
  const {operatorResponse}=req.body;
  try {
    
    if(operatorResponse==="accepted"){
      sendMessage(req.body.doctorRef,req.body)
    }
    res.status(200).json("all good")
  } catch (error) {
    next(error)
  }
}
