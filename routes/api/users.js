import { Router } from 'express';
import { auth } from '../auth.js';
import { UserController } from '../../controllers/UserController.js';
import '../../controllers/UserController.js';

export const router = Router();

router.get('/users', auth.required, UserController.all);
router.get('/users/:username', auth.required, UserController.find)

router.post('/users', UserController.create);
router.post('/users/login', UserController.login);

router.put('/users/:username', auth.required, UserController.update);