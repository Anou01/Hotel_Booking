const express = require('express');
const { createRoom, getRooms, getRoomById, updateRoom, deleteRoom } = require('../controllers/roomController');
const authenticateToken = require('../middlewares/auth');
const authorizeRole = require('../middlewares/role');

const router = express.Router();

// CRUD Routes for Room
router.post('/', authenticateToken, authorizeRole(['admin']), createRoom);
router.get('/', getRooms);
router.get('/:id', getRoomById);
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateRoom);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteRoom);

module.exports = router;
