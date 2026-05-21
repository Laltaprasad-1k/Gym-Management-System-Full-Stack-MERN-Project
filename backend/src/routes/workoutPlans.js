import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getWorkoutPlans,
  getWorkoutPlan,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
} from '../controllers/workoutPlansController.js';

const router = express.Router();

router.get('/', getWorkoutPlans);
router.get('/:id', getWorkoutPlan);

router.use(authMiddleware);

router.post('/', createWorkoutPlan);
router.put('/:id', updateWorkoutPlan);
router.delete('/:id', deleteWorkoutPlan);

export default router;
