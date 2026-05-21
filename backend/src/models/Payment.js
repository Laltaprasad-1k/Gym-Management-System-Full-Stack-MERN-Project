import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    memberName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
    },
    planName: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
