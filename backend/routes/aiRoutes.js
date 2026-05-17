const express = require('express');
const router = express.Router();
const { handleChatRequest, generateSEO } = require('../controllers/aiAgentController');

// Define API endpoint for Chatbot messages
router.post('/chat', handleChatRequest);

// Define API endpoint for SEO Generation
router.post('/generate-seo', generateSEO);

module.exports = router;
