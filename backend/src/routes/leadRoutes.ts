import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
  getLeadStats,
  getLeadGrowth,
} from '../controllers/leadController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

router.use(protect); // All lead routes require authentication

router.get('/', getLeads);
router.get('/stats', getLeadStats); // Stats endpoint
router.get('/growth', getLeadGrowth); // Growth endpoint
router.get('/export', authorize(UserRole.ADMIN), exportLeads); // Export restricted to Admin
router.post('/', createLead);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', authorize(UserRole.ADMIN), deleteLead); // Only admin can delete

export default router;
