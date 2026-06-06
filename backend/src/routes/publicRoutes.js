const express = require('express');
const linkController = require('../controllers/linkController');

const router = express.Router();

router.get('/:username', linkController.getPublicProfile);

module.exports = router;
