import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config/env.js';
import { generateOTP, storeOTP, verifyOTP } from '../services/redis.js';
import { sendOTPEmail, sendWelcomeEmail } from '../services/rabbitmq.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, gender, role } = req.body;

    // Validate input
    if (!name || !email || !password || !gender || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      gender,
      role,
    });

    await user.save();

    // Send welcome email
    await sendWelcomeEmail(email, name);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      data: user.toJSON(),
    });
  } catch (error) {
    console.error('[v0] Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      data: user.toJSON(),
    });
  } catch (error) {
    console.error('[v0] Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    await storeOTP(email, otp);

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('[v0] Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP',
    });
  }
};

export const verifyOTPAndReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required',
      });
    }

    // Verify OTP
    const isOTPValid = await verifyOTP(email, otp);
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('[v0] Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Password reset failed',
    });
  }
};

export default {
  register,
  login,
  forgotPassword,
  verifyOTPAndReset,
};
