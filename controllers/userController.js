import User from "../models/user/user.model.js";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import Medicine from "../models/medicine/medicine.model.js";
import doctorBooking from "../models/booking/doctor.booking.model.js";


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
 export const bookDoctorAppointment = async (req, res, next) =>{
  const {action}=req.body;
  try{
    
    const userId = req.user.id;
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const doctorId = req.doctor.id;
    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const doctorbooking = await doctorBooking.findById(req.params.doctorbookingId);

    if (!doctorbooking) {
        return res.status(404).json({ msg: 'Doctor Booking not found' });
    }

    if(action==='accept')
    {
     doctorbooking.status="accepted";
     doctorbooking.doctorResponse="accepted";
    }
    else if(action==='reject')
    {
      doctorbooking.status="cancelled";
      doctorbooking.doctorResponse="rejected";
    }
    else
   { return res.status(400).json({ msg: 'Invalid action' });
  }
  
  await doctorbooking.save();
  res.json({ msg: `Booking ${action}ed`, doctorbooking });
  }
  catch(error) {
    console.error("Error booking an Appointment", error);
    res.status(500).json({ message: "Internal server error" });
  }
 }