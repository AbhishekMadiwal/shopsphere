import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { DollarSign, Package, ShoppingBag, Users, Plus, ArrowRight, AlertTriangle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const fadeInUp = { hidden: { opacity: 0, y: 15 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }) };

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes, topRes, chartRes] = await Promise.all([
          API.get('/dashboard/stats'),
          API.get('/dashboard/recent-orders'),
          API.get('/dashboard/top-products'),
          API.get('/dashboard/revenue-chart'),
        ]);
        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data);
        setTopProducts(topRes.data.data);
        setChartData(chartRes.data.data);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  const lineChartData = chartData ? {
    labels: chartData.months.map((m) => m.label),
    datasets: [{
      label: 'Revenue (₹)',
      data: chartData.months.map((m) => m.revenue),
      borderColor: '#C8A97E',
      backgroundColor: 'rgba(200,169,126,0.08)',
      borderWidth: 2.5, fill: true, tension: 0.4,
      pointBackgroundColor: '#C8A97E', pointRadius: 4, pointHoverRadius: 6,
    }],
  } : null;

  const barChartData = topProducts.length > 0 ? {
    labels: topProducts.map((p) => p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name),
    datasets: [{
      label: 'Units Sold',
      data: topProducts.map((p) => p.sold),
      backgroundColor: ['rgba(200,169,126,0.85)', 'rgba(90,200,250,0.7)', 'rgba(255,149,0,0.7)', 'rgba(52,199,89,0.7)', 'rgba(255,59,48,0.7)'],
      borderRadius: 8,
    }],
  } : null;

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { font: { family: 'Inter', size: 11 } } },
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
    },
  };

  const statCards = [
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: DollarSign, gradient: 'linear-gradient(135deg, #C8A97E, #B8956A)' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: Package, gradient: 'linear-gradient(135deg, #5AC8FA, #007AFF)' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: ShoppingBag, gradient: 'linear-gradient(135deg, #34C759, #30D158)' },
    { label: 'Total Customers', value: stats?.totalUsers || 0, icon: Users, gradient: 'linear-gradient(135deg, #FF9500, #FF6B00)' },
  ];

  return (
    <div className="container-fluid py-4 px-4">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
        {/* Header */}
        <motion.div variants={fadeInUp} className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.25rem' }}>Dashboard</h2>
            <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: 0 }}>Welcome back! Here's what's happening.</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/products/add" className="btn d-flex align-items-center gap-1"
              style={{ background: 'linear-gradient(135deg, #C8A97E, #B8956A)', color: '#fff', borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', border: 'none', padding: '0.6rem 1.25rem' }}>
              <Plus size={16} /> Add Product
            </Link>
            <Link to="/admin/orders" className="btn d-flex align-items-center gap-1"
              style={{ border: '1.5px solid #e0e0e0', borderRadius: '12px', fontWeight: 600, fontSize: '0.8rem', color: '#555', padding: '0.6rem 1.25rem' }}>
              View Orders
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.label} className="col-6 col-xl-3" variants={fadeInUp} custom={i}>
                <div className="card border-0 h-100" style={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                          {card.label}
                        </p>
                        <h3 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: 0 }}>{card.value}</h3>
                      </div>
                      <div className="d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 44, height: 44, borderRadius: '12px', background: card.gradient }}>
                        <Icon size={20} color="#fff" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Order Status */}
        {stats?.ordersByStatus?.length > 0 && (
          <motion.div variants={fadeInUp} className="row g-2 mb-4">
            {stats.ordersByStatus.map((s) => {
              const colors = { Pending: '#FF9500', Processing: '#5AC8FA', Shipped: '#007AFF', Delivered: '#34C759', Cancelled: '#FF3B30' };
              return (
                <div key={s._id} className="col">
                  <div className="card border-0 text-center p-3" style={{ borderRadius: '14px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.25rem' }}>{s.count}</div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: colors[s._id] || '#999' }}>{s._id}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Charts */}
        <div className="row g-4 mb-4">
          <motion.div className="col-lg-7" variants={fadeInUp}>
            <div className="card border-0 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h6 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>Monthly Revenue (Last 6 Months)</h6>
              {lineChartData ? (
                <div style={{ height: 260 }}><Line data={lineChartData} options={chartOptions} /></div>
              ) : (
                <div className="text-center py-4" style={{ color: '#999' }}>No revenue data</div>
              )}
            </div>
          </motion.div>
          <motion.div className="col-lg-5" variants={fadeInUp}>
            <div className="card border-0 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h6 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>Top 5 Products by Sales</h6>
              {barChartData ? (
                <div style={{ height: 260 }}><Bar data={barChartData} options={chartOptions} /></div>
              ) : (
                <div className="text-center py-4" style={{ color: '#999' }}>No sales data</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders + Low Stock */}
        <div className="row g-4">
          <motion.div className="col-lg-8" variants={fadeInUp}>
            <div className="card border-0" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="d-flex justify-content-between align-items-center p-4 pb-0">
                <h6 style={{ fontWeight: 800, marginBottom: 0 }}>Recent Orders</h6>
                <Link to="/admin/orders" className="btn btn-sm d-flex align-items-center gap-1"
                  style={{ border: '1.5px solid #e0e0e0', borderRadius: '10px', fontWeight: 600, fontSize: '0.75rem', color: '#555' }}>
                  View All <ArrowRight size={12} />
                </Link>
              </div>
              <div className="p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="px-4 py-3">Order #</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td className="px-4">
                            <Link to="/admin/orders" style={{ color: '#C8A97E', fontWeight: 700, fontSize: '0.8rem' }}>
                              {order.orderNumber}
                            </Link>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{order.user?.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#999' }}>{order.user?.email}</div>
                          </td>
                          <td style={{ fontWeight: 700, fontSize: '0.85rem' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                          <td><OrderStatusBadge status={order.orderStatus} /></td>
                          <td style={{ fontSize: '0.75rem', color: '#999' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </td>
                        </tr>
                      ))}
                      {recentOrders.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-4" style={{ color: '#999' }}>No orders yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="col-lg-4" variants={fadeInUp}>
            <div className="card border-0" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="d-flex justify-content-between align-items-center p-4 pb-0">
                <h6 className="d-flex align-items-center gap-2" style={{ fontWeight: 800, marginBottom: 0 }}>
                  <AlertTriangle size={16} color="#FF9500" /> Low Stock
                </h6>
                <Link to="/admin/products" className="btn btn-sm"
                  style={{ border: '1.5px solid rgba(255,59,48,0.2)', borderRadius: '10px', fontWeight: 600, fontSize: '0.75rem', color: '#FF3B30' }}>
                  Manage
                </Link>
              </div>
              <div className="p-0">
                {chartData?.lowStockProducts?.length === 0 ? (
                  <div className="text-center py-4 px-4">
                    <div className="d-flex align-items-center justify-content-center mx-auto mb-2"
                      style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(52,199,89,0.1)' }}>
                      <Package size={20} color="#34C759" />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#999' }}>All products well stocked!</p>
                  </div>
                ) : (
                  <div className="p-3 d-flex flex-column gap-2">
                    {chartData?.lowStockProducts?.map((p) => (
                      <div key={p._id} className="d-flex align-items-center gap-3 p-2"
                        style={{ borderRadius: '12px', background: '#f7f7f7' }}>
                        <img src={p.images?.[0] || `https://placehold.co/50x50?text=P`} alt={p.name}
                          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '8px' }}
                          onError={(e) => { e.target.src = 'https://placehold.co/50x50?text=P'; }} />
                        <div className="flex-grow-1 min-w-0">
                          <div style={{ fontWeight: 600, fontSize: '0.8rem' }} className="text-truncate">{p.name}</div>
                          <span style={{
                            fontSize: '0.65rem', fontWeight: 700,
                            color: p.stock === 0 ? '#FF3B30' : '#FF9500',
                          }}>
                            {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
