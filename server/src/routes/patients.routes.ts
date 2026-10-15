import { Router } from 'express';
import { getPatients} from '../controllers/patients.controller';

const router = Router();

// GET: Main endpoint for fetching data with filtering, sorting, searching, and paging
router.post('/', (req, res) => {
    return getPatients(req, res);
});

export default router;
