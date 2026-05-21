
import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

const QUEUE_NAME = 'email_queue';

const startWorker = async () => {
  try {
    const connection = await amqp.connect(config.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log('[Worker] Waiting for messages...');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.EMAIL_USER,   // ✅ fixed
        pass: config.EMAIL_PASS,   // ✅ fixed
      },
    });

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const emailData = JSON.parse(msg.content.toString());

        try {
          await transporter.sendMail({
            from: config.EMAIL_USER,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html,
          });

          console.log('[Worker] Email sent:', emailData.to);
          channel.ack(msg);
        } catch (error) {
          console.error('[Worker] Email failed:', error);
          channel.nack(msg);
        }
      }
    });
  } catch (error) {
    console.error('[Worker] Error starting worker:', error);
  }
};

startWorker();