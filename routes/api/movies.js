import { Router } from 'express';
import { auth } from '../auth.js';
import { MovieController } from '../../controllers/MovieController.js';
import '../../controllers/MovieController.js';

export const router = Router();

router.get('/', auth.optional, MovieController.all);
router.get('/:movie', auth.optional, MovieController.find);

router.post('/', auth.required, MovieController.create);
router.post('/:movie/like', auth.required, MovieController.like);

router.put('/:movie', auth.required, MovieController.update);

router.delete('/:movie', auth.required, MovieController.delete);
router.delete('/:movie/unlike', auth.required, MovieController.unLike);