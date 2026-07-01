const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus, deleteTask, getStats } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateTask, validateTaskStatus } = require('../middleware/validationMiddleware');

// Protect all routes below with JWT auth
router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', validateTask, createTask);
router.put('/:id', validateTaskStatus, updateTaskStatus);
router.delete('/:id', deleteTask);
router.get('/stats', getStats);

module.exports = router;
