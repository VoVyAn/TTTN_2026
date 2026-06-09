const express = require('express');
const router = express.Router();
const menuSetController = require('../controllers/menuSetController');
const verifyToken = require('../middleware/auth');

router.get('/', menuSetController.getPublicMenuSets);
router.get('/admin', verifyToken, menuSetController.getAdminMenuSets);
router.post('/', verifyToken, menuSetController.createMenuSet);
router.put('/:id', verifyToken, menuSetController.updateMenuSet);
router.delete('/:id', verifyToken, menuSetController.deleteMenuSet);

module.exports = router;
