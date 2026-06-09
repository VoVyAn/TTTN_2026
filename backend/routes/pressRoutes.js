const express = require('express');
const router = express.Router();
const pressController = require('../controllers/pressController');
const verifyToken = require('../middleware/auth');

router.get('/', pressController.getPress);
router.post('/', verifyToken, pressController.createPress);
router.put('/:id', verifyToken, pressController.updatePress);
router.delete('/:id', verifyToken, pressController.deletePress);

module.exports = router;
