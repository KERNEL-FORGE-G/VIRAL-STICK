const express = require('express');
const router = express.Router();
const { handleContextReader } = require('../controllers/contextReaderController');

router.post('/', handleContextReader);

module.exports = router;