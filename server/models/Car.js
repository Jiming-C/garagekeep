import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1900, max: 2100 },
    vin: { type: String, trim: true, uppercase: true, maxlength: 17 },
    currentMileage: { type: Number, required: true, min: 0, default: 0 },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.model('Car', carSchema);
