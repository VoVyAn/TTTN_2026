const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', verifyToken, upload.single('file'), uploadController.uploadFile);

module.exports = router;
