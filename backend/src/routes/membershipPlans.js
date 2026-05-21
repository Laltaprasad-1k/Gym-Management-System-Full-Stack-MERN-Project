import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getMembershipPlans,
  getMembershipPlan,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} from '../controllers/membershipPlansController.js';

const router = express.Router();

router.get('/', getMembershipPlans);
router.get('/:id', getMembershipPlan);

router.use(authMiddleware);

router.post('/', createMembershipPlan);
router.put('/:id', updateMembershipPlan);
router.delete('/:id', deleteMembershipPlan);

export default router;
