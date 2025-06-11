import { Router } from 'express';
import { getUsers, bulkAddUsers, getUserStats } from '../controllers/user.controller';
import { validateBody, validateQuery } from '../middlewares/validation.middleware';
import { BulkAddUsersDto, GetUsersQueryDto } from '../dtos/user.dto';

const router = Router();

router.get('/', validateQuery(GetUsersQueryDto), getUsers);
router.post('/bulk-add', validateBody(BulkAddUsersDto), bulkAddUsers);
router.get('/stats', getUserStats);

export default router;
