import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true, index: true },
    type: { type: String, required: true, trim: true, maxlength: 60 },
    date: { type: Date, required: true, default: () => new Date() },
    mileage: { type: Number, required: true, min: 0 },
    cost: { type: Number, min: 0, default: 0 },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

serviceSchema.index({ car: 1, date: -1 });

export default mongoose.model('Service', serviceSchema);
