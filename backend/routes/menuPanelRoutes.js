const express = require('express');
const router = express.Router();
const menuPanelController = require('../controllers/menuPanelController');
const verifyToken = require('../middleware/auth');

router.get('/', menuPanelController.getPublicMenuPanels);
router.get('/admin', verifyToken, menuPanelController.getAdminMenuPanels);
router.post('/', verifyToken, menuPanelController.createMenuPanel);
router.put('/:id', verifyToken, menuPanelController.updateMenuPanel);
router.delete('/:id', verifyToken, menuPanelController.deleteMenuPanel);

module.exports = router;
