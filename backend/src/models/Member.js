import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    plan: {
      type: String,
      enum: ['basic', 'standard', 'premium', 'yearly'],
    },
    membershipPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
    },
    workoutPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
    },
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model('Member', memberSchema);

export default Member;
