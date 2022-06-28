import { Router} from 'express';
import  {router as routes} from './api/index.js';

export const router = Router();

router.use('/api', routes);

// module.exports = router;