import { Router } from 'express';
import {router as UserRoutes} from './users.js';
import {router as MovieRoutes} from './movies.js';

export const router = Router();

router.use('/', UserRoutes);
router.use('/movies', MovieRoutes);

router.use( (err, req, res, next) =>{
    if (err.name === 'ValidationError') {
        return res.status(422).json({
            errors: Object.keys(err.errors).reduce((errors, key) => {
                errors[key] = err.errors[key].message;

                return errors;
            }, {})
        });
    }
})

// module.exports = router;