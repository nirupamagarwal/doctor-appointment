import User from "../models/user/user.model.js";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import Medicine from "../models/medicine/medicine.model.js";
import DoctorBooking from "../models/appointment/doctorAppointment.model.js";
import { sendMessage } from "../index.js";
import History from "../models/medicalHistory/patientHistory.js";

export default async (req, res, next) => {
  try {
    const { email, phoneNumber, facebookId } = req.body;

    let user = await User.findOne({
      $or: [
        { email: email || !null },
        { phoneNumber: phoneNumber || !null },
        { facebookId: facebookId || !null },
      ],
    });

    // If the user does not exist, create a new user
    if (!user) {
      user = new User(req.body);
      await user.save();
      res.status(201); // Set status to 201 Created for new user
    } else {
      res.status(200); // Set status to 200 OK for existing user
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Respond with user data and token
    res.json({ user, token });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

export const getProfileInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(errorHandler(404, "User Not Found"));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
export const updateUserInfo = async (req, res, next) => {
  console.log(req.user.id);
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!user) return next(errorHandler(404, "User Not Found"));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const orderMedicine = async (req, res, next) => {
  try {
    const { medicineRef, quantity, shippingAddress } = req.body;
    const userId = req.user.id;
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the medicine
    const medicine = await Medicine.findById(medicineRef);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // Use the default address if no shipping address is provided
    const address = shippingAddress || user.address;
    console.log(user);
    // Create the order details
    const orderDetails = {
      medicineRef: medicineRef,
      userRef: userId,
      quantity,
      orderStatus: "placed",
      orderDate: new Date(),
      contactInfo: user.phoneNumber, // Assuming contact info is the user's phone number
      shippingAddress: address,
    };

    // Update the user's medicineOrdered array
    user.medicineOrdered.push(orderDetails);
    await user.save();

    // Update the medicine's ordered array
    medicine.orders.push(orderDetails);
    await medicine.save();

    // Optionally update the vendor's stock (if applicable)
    // Assuming medicine has a `vendor` field that references the Vendor model
    // const vendor = await Vendor.findById(medicine.vendor);
    // if (vendor) {
    //   // Update vendor stock or other relevant fields if necessary
    //   // For example:
    //   // vendor.stock -= quantity;
    //   // await vendor.save();
    // }

    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const bookDocter = async (req, res, next) => {
  const userId = req.user.id;
  const { address, ...rest } = req.body;
  console.log(address)
  try {
    const user = await User.findById(userId);
   const patientAddress = address || user.address;
    const newbooking = new DoctorBooking({
      rest,
      patientAddress,
    });
    // await newbooking.save()

    user.appointmentBooked.push(newbooking);
    // await user.save();
   sendMessage("66b703e5339abb8e49c4cb5e", {disease:req.body.disease,userId:userId,fees:400})
res.status(200).json("request sent to operator")
  } catch (error) {
    next(error)
  }
};

export const medicalHistory = async (req, res, next) => {
  const userId = req.user.id;
  const { conditions, medications, allergies, surgeries, familyHistory } = req.body;

  try {
    // Verify that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new medical history record
    const patientHistory = new History({
      userId,
      conditions,
      medications,
      allergies,
      surgeries,
      familyHistory,
    });

    // Save the medical history record

    // Update the user's medical history reference
    user.userHistory.push(patientHistory); // Push the ObjectId into the array
    await user.save(); // Save the user with the updated history reference

    // Respond with the newly created history record
    res.status(201).json(patientHistory);
  } catch (error) {
    console.error('Error creating medical history:', error);
    res.status(500).json({ message: 'Error creating medical history', error });
  }
};