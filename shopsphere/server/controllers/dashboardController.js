const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard stats (admin)
// @route   GET /api/dashboard/stats
const getStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const [totalUsers, totalOrders, totalProducts, revenueData] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        ordersByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent orders (admin)
// @route   GET /api/dashboard/recent-orders
const getRecentOrders = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top 5 products by sales (admin)
// @route   GET /api/dashboard/top-products
const getTopProducts = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const products = await Product.find({ isActive: true })
      .select('name sold price images ratings')
      .sort({ sold: -1 })
      .limit(5)
      .lean();

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly revenue for last 6 months (admin)
// @route   GET /api/dashboard/revenue-chart
const getRevenueChart = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          orderStatus: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Fill in missing months with 0
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const found = revenueData.find((r) => r._id.year === year && r._id.month === month);
      months.push({
        label: `${monthNames[month - 1]} ${year}`,
        revenue: found?.revenue || 0,
        orders: found?.orders || 0,
      });
    }

    // Low stock alert
    const lowStockProducts = await Product.find({ isActive: true, stock: { $lt: 10 } })
      .select('name stock images')
      .sort({ stock: 1 })
      .limit(10)
      .lean();

    res.json({ success: true, data: { months, lowStockProducts } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getRecentOrders, getTopProducts, getRevenueChart };
