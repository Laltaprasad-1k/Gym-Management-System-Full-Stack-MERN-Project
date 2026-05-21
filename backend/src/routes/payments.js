import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
} from '../controllers/paymentsController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/verify', verifyPayment);
router.post('/create-order', createPaymentOrder);
router.get('/history', getPaymentHistory);

export default router;
