const express = require('express');
const router = express.Router();
const controller = require('../controllers/Summary.controller');

// Define route for summary generation
router.post('/generate-summary', controller.summary);

module.exports = router;
