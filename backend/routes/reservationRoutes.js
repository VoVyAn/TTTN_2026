const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const verifyToken = require('../middleware/auth');

router.get('/', reservationController.getReservations);
router.post('/', reservationController.createReservation);
router.put('/:id', verifyToken, reservationController.updateReservationStatus);
router.delete('/:id', verifyToken, reservationController.deleteReservation);

module.exports = router;
