const express = require('express');
const { register, profile, updateProfile, deleteAccount,getUsers,login,createUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

// CRUD Routes for User
router.post('/register', register);
router.put('/:id', authenticateToken, updateProfile);
router.post('/',authenticateToken, createUser);
router.post('/login', login);
router.get('/', authenticateToken, getUsers);
router.get('/profile', authenticateToken, profile);
router.delete('/:id', authenticateToken, deleteAccount);

module.exports = router;
