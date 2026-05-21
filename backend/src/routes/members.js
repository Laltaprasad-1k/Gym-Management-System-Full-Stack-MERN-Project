import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
} from '../controllers/membersController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMembers);
router.get('/:id', getMember);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;

