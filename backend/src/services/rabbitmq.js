import amqp from 'amqplib';
import { config } from '../config/env.js';

let channel = null;
const QUEUE_NAME = 'email_queue';

export const initRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(config.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('RabbitMQ connected');
  } catch (error) {
    console.log('RabbitMQ connection failed, email features will be limited:', error.message);
  }
};

export const sendEmail = async (to, subject, html) => {
  try {
    if (channel) {
      const emailData = {
        to,
        subject,
        html,
        timestamp: new Date(),
      };
      channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(emailData)), {
        persistent: true,
      });
      console.log('[v0] Email queued:', to);
      return true;
    }
    console.log('[v0] RabbitMQ not available, email not sent');
    return false;
  } catch (error) {
    console.error('[v0] Error sending email:', error);
    return false;
  }
};

export const sendOTPEmail = async (email, otp) => {
  const subject = 'Reset Your Password - FitHub';
  const html = `
    <h2>Password Reset Request</h2>
    <p>Your OTP code is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;
  return sendEmail(email, subject, html);
};

export const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to FitHub';
  const html = `
    <h2>Welcome, ${name}!</h2>
    <p>Your account has been created successfully.</p>
    <p>Log in to start your fitness journey with FitHub.</p>
  `;
  return sendEmail(email, subject, html);
};

export const sendMembershipConfirmation = async (email, name, plan, amount) => {
  const subject = 'Membership Confirmation - FitHub';
  const html = `
    <h2>Membership Confirmed</h2>
    <p>Hi ${name},</p>
    <p>Thank you for your payment of ₹${amount} for the ${plan} plan.</p>
    <p>Your membership is now active. Start working out!</p>
  `;
  return sendEmail(email, subject, html);
};

export default {
  initRabbitMQ,
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendMembershipConfirmation,
};
