const express = require('express');
const router = express.Router();
const { handleChatRequest, generateSEO, getInventoryAnalytics, applyPriceAdjustment, getReviewSummary } = require('../controllers/aiAgentController');

// Define API endpoint for Chatbot messages
router.post('/chat', handleChatRequest);

// Define API endpoint for SEO Generation
router.post('/generate-seo', generateSEO);

// Define API endpoint for AI Inventory Analytics & Forecasting
router.get('/inventory-analytics', getInventoryAnalytics);

// Define API endpoint to Apply AI Suggested Price Drop
router.post('/apply-price-adjustment', applyPriceAdjustment);

// Define API endpoint for AI Customer Sentiment & Review Summary
router.get('/review-summary/:id', getReviewSummary);

module.exports = router;
