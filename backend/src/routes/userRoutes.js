const express = require('express');
const { verifyToken } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(verifyToken);

router.put('/profile', userController.updateProfile);

module.exports = router;
