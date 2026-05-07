import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import Pagination from '../../components/Pagination';
import { Package, ArrowRight, ShoppingBag } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await API.get(`/orders/my-orders?page=${page}&limit=10`);
      setOrders(data.data.orders);
      setPagination(data.data.pagination);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) return <Loader text="Loading your orders..." />;

  return (
    <div className="container py-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="d-flex align-items-center gap-3 mb-4">
        <h2 style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: 0 }}>My Orders</h2>
        <span style={{
          background: 'rgba(200,169,126,0.12)', color: '#C8A97E',
          fontWeight: 700, fontSize: '0.8rem', padding: '0.3rem 0.75rem', borderRadius: '50px',
        }}>{pagination.total} orders</span>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-5">
          <div className="d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(200,169,126,0.08)' }}>
            <Package size={42} color="#C8A97E" />
          </div>
          <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: '#999', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
            Looks like you haven't placed any orders. Start shopping!
          </p>
          <Link to="/products" className="btn btn-lg d-inline-flex align-items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #C8A97E, #B8956A)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 700, padding: '0.9rem 2rem' }}>
            <ShoppingBag size={18} /> Start Shopping
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="d-flex flex-column gap-3">
            {orders.map((order, i) => (
              <motion.div key={order._id}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="card border-0"
                  style={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                  <div className="card-body p-4">
                    <div className="row align-items-center g-3">
                      <div className="col-md-3">
                        <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                          Order Number
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#C8A97E' }}>{order.orderNumber}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                          Items
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#999' }}>
                          {order.items?.slice(0, 2).map(i => i.name).join(', ')}
                          {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                          Total
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '0.7rem', color: '#999' }}>{order.paymentMethod}</div>
                      </div>
                      <div className="col-md-2">
                        <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.25rem' }}>
                          Status
                        </div>
                        <OrderStatusBadge status={order.orderStatus} />
                      </div>
                      <div className="col-md-2 text-md-end">
                        <Link to={`/orders/${order._id}`}
                          className="btn d-inline-flex align-items-center gap-1"
                          style={{
                            border: '1.5px solid #e0e0e0', borderRadius: '10px',
                            fontWeight: 600, fontSize: '0.8rem', color: '#555', padding: '0.5rem 1rem',
                          }}>
                          Details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4">
            <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={(p) => fetchOrders(p)} />
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
