

// src/controllers/paymentsController.js

import Payment from '../models/Payment.js';
import Member from '../models/Member.js';
// import Razorpay from 'razorpay'; // Uncomment when you have live keys
import { sendMembershipConfirmation } from '../services/rabbitmq.js';

// ------------------------------
// Temporary Razorpay client setup
// ------------------------------
// Uncomment below lines when you have live/test Razorpay keys
/*
import dotenv from 'dotenv';
dotenv.config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
*/

// ------------------------------
// Create Payment Order
// ------------------------------
export const createPaymentOrder = async (req, res) => {
  try {
    const { memberId, amount, planId, planName } = req.body;

    if (!memberId || !amount || !planId) {
      return res.status(400).json({
        success: false,
        message: 'Member ID, amount, and plan ID are required',
      });
    }

    // Dummy Razorpay order creation
    // Replace with actual Razorpay API call when keys are ready
    const order = {
      id: `order_${Date.now()}`,
      amount: amount * 100, // in paise
      currency: 'INR',
    };

    // Save payment in DB
    const member = await Member.findById(memberId);
    const payment = await Payment.create({
      memberId,
      memberName: member ? member.name : 'Unknown Member',
      planId,
      planName,
      amount,
      razorpayOrderId: order.id,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Payment order created',
      data: {
        orderId: order.id,
        paymentId: payment._id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error('[v0] Create payment order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order',
    });
  }
};

// ------------------------------
// Verify Payment
// ------------------------------
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!paymentId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID and Razorpay details are required',
      });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Update payment
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'completed';
    await payment.save();

    // Activate member
    const member = await Member.findById(payment.memberId);
    if (member) {
      member.status = 'active';
      member.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await member.save();

      // Send confirmation email (dummy)
      await sendMembershipConfirmation(member.email, member.name, payment.planName, payment.amount);
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: payment,
    });
  } catch (error) {
    console.error('[v0] Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ------------------------------
// Get Payment History
// ------------------------------
export const getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const payments = await Payment.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments();

    res.json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[v0] Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payment history',
    });
  }
};

// ------------------------------
// Export all functions
// ------------------------------
export default {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
};