import mongoose from "mongoose";

export const medicalHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    conditions: [{ type: String }],
    medications: [{ type: String }],
    allergies: [{ type: String }],
    surgeries: [{ type: String }],
    familyHistory: [{ type: String }],
}, 
{ timestamps: true });

const History = mongoose.model('medicalHistory', medicalHistorySchema);
export default History;
