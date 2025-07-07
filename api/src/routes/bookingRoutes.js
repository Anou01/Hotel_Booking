const express = require('express');
const { createBooking, getUserBookings, cancelBooking, deleteBooking ,getBookingsByRoomId,checkOutBooking,checkInBooking,getBookingStats} = require('../controllers/bookingController');
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

// CRUD Routes for Bookings
router.post('/', authenticateToken, createBooking);
router.get('/', authenticateToken, getUserBookings);
router.get('/booking-stats', authenticateToken, getBookingStats);
router.get('/get-booking/:id', authenticateToken, getBookingsByRoomId);
router.post('/:bookingId/checkout', authenticateToken, checkOutBooking);
router.post('/:bookingId/checkin', authenticateToken, checkInBooking);
router.put('/:id', authenticateToken, cancelBooking);
router.delete('/:id', authenticateToken, deleteBooking);

module.exports = router;
