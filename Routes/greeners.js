import express from 'express';
import { updateGreener, deleteGreener, getAllGreener, getSingleGreener, getGreenerProfile } from "../Controllers/greenerController.js";
import { authenticate, restrict } from '../auth/verifyToken.js';
import reviewRouter from './review.js';

const router = express.Router();

router.use('/:greenerId/reviews', reviewRouter);
router.get('/:id', getSingleGreener);
router.get('/', getAllGreener);
router.put('/:id', authenticate, restrict(['greener']), updateGreener);
router.delete('/:id', authenticate, restrict(['greener']), deleteGreener);
router.get('/profile/me', authenticate, restrict(['greener']), getGreenerProfile);

export default router;