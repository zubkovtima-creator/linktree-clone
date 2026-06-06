const express = require('express');
const { verifyToken } = require('../middleware/auth');
const linkController = require('../controllers/linkController');

const router = express.Router();

router.use(verifyToken);

router.get('/', linkController.getMyLinks);
router.post('/', linkController.createLink);
router.put('/reorder', linkController.reorderLinks);
router.put('/:id', linkController.updateLink);
router.delete('/:id', linkController.deleteLink);

module.exports = router;
