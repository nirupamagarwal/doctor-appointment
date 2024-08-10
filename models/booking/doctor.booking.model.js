import mongoose from "mongoose";
import addressSchema from '../general/address.model';

const doctorBookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    patientAddress: addressSchema,
    
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'cancelled'],
        default: 'pending',
    },
    doctorResponse: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
},
{ timestamps: true },
);

const doctorBooking = mongoose.model('doctorBooking', doctorBookingSchema);
export default doctorBooking;