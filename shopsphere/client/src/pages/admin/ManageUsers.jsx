import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { Users, Search, X, User, ShieldCheck, Shield, Package, Mail, Phone, Calendar, MapPin } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [toggling, setToggling] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchUsers = async (p = 1, s = search) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: p, limit: 15 });
      if (s) params.set('search', s);
      const { data } = await API.get(`/users?${params}`);
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(1, search); };

  const handleToggle = async (userId, name, isActive) => {
    try {
      setToggling(userId);
      await API.put(`/users/${userId}/toggle`);
      toast.success(`${name} ${isActive ? 'deactivated' : 'activated'}`);
      fetchUsers(page, search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle user status');
    } finally {
      setToggling(null);
    }
  };

  const openUserModal = async (userId) => {
    try {
      setModalLoading(true);
      setShowModal(true);
      const { data } = await API.get(`/users/${userId}`);
      setSelectedUser(data.data.user);
      setUserOrders(data.data.orders);
    } catch {
      toast.error('Failed to load user details');
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4 px-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="d-flex align-items-center gap-2" style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.25rem' }}>
            <Users size={24} color="#C8A97E" /> Manage Users
          </h2>
          <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: 0 }}>{pagination.total} registered users</p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="card border-0 mb-4 p-3" style={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <div className="flex-grow-1 position-relative">
            <Search size={14} color="#999" className="position-absolute" style={{ top: '50%', left: 12, transform: 'translateY(-50%)' }} />
            <input type="text" className="form-control" placeholder="Search by name or email..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.2rem', borderRadius: '10px' }} />
          </div>
          <button type="submit" className="btn"
            style={{ background: '#0a0a0a', color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', padding: '0 1.25rem', border: 'none' }}>
            Search
          </button>
          {search && (
            <button type="button" className="btn"
              onClick={() => { setSearch(''); fetchUsers(1, ''); }}
              style={{ border: '1.5px solid #e0e0e0', borderRadius: '10px', fontWeight: 600, fontSize: '0.8rem', color: '#555' }}>
              Clear
            </button>
          )}
        </form>
      </div>

      {loading ? <Loader text="Loading users..." /> : (
        <>
          <div className="card border-0" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                            style={{
                              width: 38, height: 38, fontWeight: 700, fontSize: '0.85rem',
                              background: u.role === 'admin' ? 'linear-gradient(135deg, #C8A97E, #B8956A)' : '#f0f0f0',
                              color: u.role === 'admin' ? '#fff' : '#555',
                            }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{u.name}</div>
                            {u.phone && <div style={{ fontSize: '0.7rem', color: '#999' }}>{u.phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#555' }}>{u.email}</td>
                      <td>
                        <span className="d-inline-flex align-items-center gap-1"
                          style={{
                            background: u.role === 'admin' ? 'rgba(200,169,126,0.1)' : 'rgba(0,0,0,0.03)',
                            color: u.role === 'admin' ? '#C8A97E' : '#555',
                            fontWeight: 700, fontSize: '0.7rem', padding: '0.25rem 0.6rem', borderRadius: '50px',
                          }}>
                          {u.role === 'admin' ? <ShieldCheck size={12} /> : <User size={12} />}
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: '#999' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '50px',
                          background: u.isActive ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)',
                          color: u.isActive ? '#34C759' : '#FF3B30',
                        }}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1 justify-content-center">
                          <button className="btn btn-sm"
                            onClick={() => openUserModal(u._id)}
                            style={{ border: '1.5px solid #e0e0e0', borderRadius: '10px', fontWeight: 600, fontSize: '0.7rem', color: '#555', padding: '0.3rem 0.75rem' }}>
                            View
                          </button>
                          {u.role !== 'admin' && (
                            <button className="btn btn-sm"
                              onClick={() => handleToggle(u._id, u.name, u.isActive)}
                              disabled={toggling === u._id}
                              style={{
                                border: `1.5px solid ${u.isActive ? 'rgba(255,59,48,0.2)' : 'rgba(52,199,89,0.2)'}`,
                                borderRadius: '10px', fontWeight: 600, fontSize: '0.7rem',
                                color: u.isActive ? '#FF3B30' : '#34C759',
                                padding: '0.3rem 0.75rem', background: 'transparent',
                              }}>
                              {toggling === u._id ? <span className="spinner-border spinner-border-sm" /> : (u.isActive ? 'Deactivate' : 'Activate')}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-4" style={{ color: '#999' }}>No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4">
            <Pagination currentPage={pagination.page} totalPages={pagination.pages}
              onPageChange={(p) => { setPage(p); fetchUsers(p, search); }} />
          </div>
        </>
      )}

      {/* User Detail Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-4 w-100"
              style={{ maxWidth: 600, maxHeight: '85vh', overflowY: 'auto', borderRadius: '24px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}>

              {modalLoading ? <Loader text="Loading user data..." /> : selectedUser && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 style={{ fontWeight: 800, marginBottom: 0 }}>User Profile</h5>
                    <button className="btn p-0 border-0" onClick={() => setShowModal(false)}>
                      <X size={20} color="#999" />
                    </button>
                  </div>

                  {/* User Header */}
                  <div className="d-flex align-items-center gap-3 mb-4 p-3"
                    style={{ background: '#f7f7f7', borderRadius: '16px' }}>
                    <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{
                        width: 56, height: 56, fontWeight: 800, fontSize: '1.3rem',
                        background: selectedUser.role === 'admin' ? 'linear-gradient(135deg, #C8A97E, #B8956A)' : '#e0e0e0',
                        color: selectedUser.role === 'admin' ? '#fff' : '#555',
                      }}>
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 style={{ fontWeight: 800, marginBottom: '0.15rem', fontSize: '1.1rem' }}>{selectedUser.name}</h5>
                      <span className="d-inline-flex align-items-center gap-1"
                        style={{
                          background: selectedUser.role === 'admin' ? 'rgba(200,169,126,0.1)' : 'rgba(0,0,0,0.03)',
                          color: selectedUser.role === 'admin' ? '#C8A97E' : '#555',
                          fontWeight: 700, fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '50px',
                        }}>
                        {selectedUser.role === 'admin' ? <ShieldCheck size={12} /> : <User size={12} />}
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <Mail size={14} color="#999" />
                      <span style={{ fontSize: '0.85rem' }}>{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="d-flex align-items-center gap-2">
                        <Phone size={14} color="#999" />
                        <span style={{ fontSize: '0.85rem' }}>{selectedUser.phone}</span>
                      </div>
                    )}
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={14} color="#999" />
                      <span style={{ fontSize: '0.85rem' }}>
                        Joined {new Date(selectedUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    {selectedUser.address?.street && (
                      <div className="d-flex align-items-start gap-2">
                        <MapPin size={14} color="#999" className="mt-1" />
                        <span style={{ fontSize: '0.85rem' }}>
                          {selectedUser.address.street}, {selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.pincode}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Orders */}
                  {userOrders.length > 0 && (
                    <>
                      <h6 className="d-flex align-items-center gap-2" style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                        <Package size={14} color="#C8A97E" /> Recent Orders ({userOrders.length})
                      </h6>
                      <div className="d-flex flex-column gap-2">
                        {userOrders.slice(0, 5).map((order) => (
                          <div key={order._id} className="d-flex align-items-center justify-content-between p-2"
                            style={{ borderRadius: '10px', background: '#f7f7f7' }}>
                            <div>
                              <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#C8A97E' }}>{order.orderNumber}</span>
                              <span style={{ fontSize: '0.7rem', color: '#999', marginLeft: '0.5rem' }}>
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                              <OrderStatusBadge status={order.orderStatus} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageUsers;
