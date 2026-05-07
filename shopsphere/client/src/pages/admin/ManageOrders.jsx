import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import Pagination from '../../components/Pagination';
import { ClipboardList, X, MapPin, CreditCard, RefreshCw, Check } from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', note: '' });
  const [updating, setUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async (p = page, sf = statusFilter) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: p, limit: 10 });
      if (sf) params.set('status', sf);
      const { data } = await API.get(`/orders?${params}`);
      setOrders(data.data.orders);
      setPagination(data.data.pagination);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusFilter = (sf) => { setStatusFilter(sf); setPage(1); fetchOrders(1, sf); };
  const handlePageChange = (p) => { setPage(p); fetchOrders(p, statusFilter); };

  const openModal = async (order) => {
    try {
      const { data } = await API.get(`/orders/${order._id}`);
      setSelectedOrder(data.data);
      setStatusUpdate({ status: data.data.orderStatus, note: '' });
      setShowModal(true);
    } catch {
      toast.error('Failed to load order details');
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusUpdate.status) { toast.error('Please select a status'); return; }
    try {
      setUpdating(true);
      const { data } = await API.put(`/orders/${selectedOrder._id}/status`, statusUpdate);
      setSelectedOrder(data.data);
      toast.success('Order status updated successfully');
      fetchOrders(page, statusFilter);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container-fluid py-4 px-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="d-flex align-items-center gap-2" style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.25rem' }}>
            <ClipboardList size={24} color="#C8A97E" /> Manage Orders
          </h2>
          <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: 0 }}>{pagination.total} total orders</p>
        </div>
      </motion.div>

      {/* Status Filter */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button className="btn btn-sm"
          onClick={() => handleStatusFilter('')}
          style={{
            background: !statusFilter ? '#0a0a0a' : 'transparent',
            color: !statusFilter ? '#fff' : '#555',
            border: !statusFilter ? 'none' : '1.5px solid #e0e0e0',
            borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', padding: '0.45rem 1rem',
          }}>All Orders</button>
        {STATUS_OPTIONS.map((s) => {
          const colors = { Pending: '#FF9500', Processing: '#5AC8FA', Shipped: '#007AFF', Delivered: '#34C759', Cancelled: '#FF3B30' };
          return (
            <button key={s} className="btn btn-sm"
              onClick={() => handleStatusFilter(s)}
              style={{
                background: statusFilter === s ? `${colors[s]}15` : 'transparent',
                color: statusFilter === s ? colors[s] : '#555',
                border: statusFilter === s ? `1.5px solid ${colors[s]}40` : '1.5px solid #e0e0e0',
                borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', padding: '0.45rem 1rem',
              }}>{s}</button>
          );
        })}
      </div>

      {loading ? <Loader text="Loading orders..." /> : orders.length === 0 ? (
        <div className="text-center py-5">
          <ClipboardList size={48} color="#C8A97E" className="mb-3" style={{ opacity: 0.3 }} />
          <h4 style={{ fontWeight: 800 }}>No orders found</h4>
          <p style={{ color: '#999', fontSize: '0.85rem' }}>
            {statusFilter ? `No ${statusFilter.toLowerCase()} orders` : 'No orders yet'}
          </p>
        </div>
      ) : (
        <>
          <div className="card border-0" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3">Order #</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-4">
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#C8A97E' }}>{order.orderNumber}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{order.user?.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#999' }}>{order.user?.email}</div>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                      <td style={{ fontWeight: 700, fontSize: '0.85rem' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#555' }}>{order.paymentMethod}</span>
                        <div>
                          <span style={{
                            fontSize: '0.65rem', fontWeight: 700,
                            color: order.paymentStatus === 'Paid' ? '#34C759' : '#FF9500',
                          }}>{order.paymentStatus}</span>
                        </div>
                      </td>
                      <td><OrderStatusBadge status={order.orderStatus} /></td>
                      <td style={{ fontSize: '0.75rem', color: '#999' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="text-center">
                        <button className="btn btn-sm" onClick={() => openModal(order)}
                          style={{
                            border: '1.5px solid #e0e0e0', borderRadius: '10px',
                            fontWeight: 600, fontSize: '0.75rem', color: '#555', padding: '0.35rem 0.85rem',
                          }}>
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4">
            <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
          </div>
        </>
      )}

      {/* ─── ORDER DETAIL MODAL ──────────────────────────── */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-4 w-100"
              style={{ maxWidth: 700, maxHeight: '85vh', overflowY: 'auto', borderRadius: '24px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 style={{ fontWeight: 800, marginBottom: '0.15rem' }}>Order #{selectedOrder.orderNumber}</h5>
                  <p style={{ color: '#999', fontSize: '0.8rem', marginBottom: 0 }}>
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button className="btn p-0 border-0" onClick={() => setShowModal(false)}>
                  <X size={20} color="#999" />
                </button>
              </div>

              {/* Customer & Address */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="p-3" style={{ background: '#f7f7f7', borderRadius: '14px' }}>
                    <h6 className="d-flex align-items-center gap-2" style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      <MapPin size={14} color="#C8A97E" /> Shipping
                    </h6>
                    <div style={{ fontSize: '0.8rem', color: '#555' }}>
                      <strong>{selectedOrder.user?.name}</strong><br />
                      {selectedOrder.shippingAddress?.street}<br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                      {selectedOrder.shippingAddress?.pincode}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3" style={{ background: '#f7f7f7', borderRadius: '14px' }}>
                    <h6 className="d-flex align-items-center gap-2" style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      <CreditCard size={14} color="#C8A97E" /> Payment
                    </h6>
                    <div style={{ fontSize: '0.8rem', color: '#555' }}>
                      {selectedOrder.paymentMethod} · <span style={{ color: selectedOrder.paymentStatus === 'Paid' ? '#34C759' : '#FF9500', fontWeight: 700 }}>{selectedOrder.paymentStatus}</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '0.25rem' }}>
                      ₹{selectedOrder.totalAmount?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <h6 style={{ fontWeight: 800, marginBottom: '0.75rem', fontSize: '0.85rem' }}>Items ({selectedOrder.items?.length})</h6>
              <div className="d-flex flex-column gap-2 mb-4">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3 p-2"
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <img src={item.image || 'https://placehold.co/40x40?text=P'} alt={item.name}
                      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '10px' }}
                      onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=P'; }} />
                    <div className="flex-grow-1">
                      <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#999' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Status Update */}
              <div className="p-3" style={{ background: 'rgba(200,169,126,0.04)', borderRadius: '14px', border: '1px solid rgba(200,169,126,0.15)' }}>
                <h6 className="d-flex align-items-center gap-2" style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  <RefreshCw size={14} color="#C8A97E" /> Update Status
                </h6>
                <div className="row g-2">
                  <div className="col-md-4">
                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#999' }}>Current</label>
                    <div><OrderStatusBadge status={selectedOrder.orderStatus} /></div>
                  </div>
                  <div className="col-md-4">
                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#999' }}>New Status</label>
                    <select className="form-select form-select-sm" value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate((prev) => ({ ...prev, status: e.target.value }))}
                      style={{ borderRadius: '10px' }}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#999' }}>Note</label>
                    <input type="text" className="form-control form-control-sm" placeholder="Optional note"
                      value={statusUpdate.note}
                      onChange={(e) => setStatusUpdate((prev) => ({ ...prev, note: e.target.value }))}
                      style={{ borderRadius: '10px' }} />
                  </div>
                </div>
                <button className="btn w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleStatusUpdate} disabled={updating || statusUpdate.status === selectedOrder.orderStatus}
                  style={{
                    background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                    color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', padding: '0.65rem',
                  }}>
                  {updating ? <span className="spinner-border spinner-border-sm" /> : <Check size={16} />}
                  Update Status
                </button>
              </div>

              {/* Timeline */}
              {selectedOrder.statusHistory?.length > 0 && (
                <div className="mt-4">
                  <h6 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem' }}>Timeline</h6>
                  {[...selectedOrder.statusHistory].reverse().map((hist, idx) => (
                    <div key={idx} className="d-flex gap-3 mb-2">
                      <div className="d-flex flex-column align-items-center">
                        <div className="d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: 24, height: 24, borderRadius: '50%',
                            background: idx === 0 ? 'linear-gradient(135deg, #C8A97E, #B8956A)' : '#e0e0e0',
                            color: idx === 0 ? '#fff' : '#bbb', fontSize: '0.5rem',
                          }}>●</div>
                        {idx < selectedOrder.statusHistory.length - 1 && (
                          <div style={{ width: 2, flexGrow: 1, background: '#e0e0e0', minHeight: 12 }} />
                        )}
                      </div>
                      <div className="pb-1">
                        <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{hist.status}</span>
                        {hist.note && <span style={{ color: '#999', fontSize: '0.7rem' }}> — {hist.note}</span>}
                        <div style={{ fontSize: '0.65rem', color: '#bbb' }}>
                          {new Date(hist.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageOrders;
