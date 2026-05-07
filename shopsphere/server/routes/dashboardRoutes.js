const express = require('express');
const router = express.Router();
const { getStats, getRecentOrders, getTopProducts, getRevenueChart } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.get('/stats', protect, adminOnly, getStats);
router.get('/recent-orders', protect, adminOnly, getRecentOrders);
router.get('/top-products', protect, adminOnly, getTopProducts);
router.get('/revenue-chart', protect, adminOnly, getRevenueChart);

module.exports = router;
