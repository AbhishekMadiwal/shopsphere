import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, MapPin, Phone, Mail, Calendar, Package, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
      country: user?.address?.country || '',
    },
  });
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  useEffect(() => {
    API.get('/orders/my-orders?limit=1').then(({ data }) => {
      setOrderCount(data.data.pagination.total);
    }).catch(() => {});
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const { data } = await API.put('/auth/profile', profileForm);
      updateUser(data.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { toast.error('New passwords do not match'); return; }
    if (pwdForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      setPwdLoading(true);
      await API.put('/auth/change-password', { oldPassword: pwdForm.oldPassword, newPassword: pwdForm.newPassword });
      toast.success('Password changed successfully!');
      setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '1.5rem' }}>
        My Profile
      </motion.h2>

      {/* User Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="card border-0 mb-4 p-4" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)', border: 'none' }}>
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
              width: 72, height: 72, fontWeight: 800, fontSize: '1.8rem',
              background: 'linear-gradient(135deg, #C8A97E, #B8956A)', color: '#fff',
            }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow-1">
            <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>{user?.name}</h4>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: 0 }}>{user?.email}</p>
          </div>
          <div className="d-flex gap-4">
            {[
              [Package, orderCount, 'Orders'],
              [User, user?.role === 'customer' ? 'Customer' : 'Admin', 'Role'],
              [Calendar, new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }), 'Joined'],
            ].map(([Icon, val, label]) => (
              <div key={label} className="text-center">
                <div style={{ color: '#C8A97E', fontWeight: 800, fontSize: '1.1rem' }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="row g-4">
        {/* Profile Form */}
        <div className="col-lg-7">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="card border-0 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h5 className="d-flex align-items-center gap-2" style={{ fontWeight: 800, marginBottom: '1.5rem' }}>
                <User size={18} color="#C8A97E" /> Edit Profile
              </h5>
              <form onSubmit={handleProfileSave}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Full Name</label>
                    <input type="text" className="form-control" value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required style={{ borderRadius: '12px' }} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label d-flex align-items-center gap-1" style={{ fontWeight: 600, fontSize: '0.8rem' }}>
                      <Mail size={13} /> Email
                    </label>
                    <input type="email" className="form-control" value={user?.email} disabled
                      style={{ borderRadius: '12px', background: '#f7f7f7' }} />
                    <small style={{ color: '#999', fontSize: '0.7rem' }}>Email cannot be changed</small>
                  </div>
                  <div className="col-12">
                    <label className="form-label d-flex align-items-center gap-1" style={{ fontWeight: 600, fontSize: '0.8rem' }}>
                      <Phone size={13} /> Phone
                    </label>
                    <input type="tel" className="form-control" placeholder="+91 98765 43210"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      style={{ borderRadius: '12px' }} />
                  </div>

                  <div className="col-12">
                    <h6 className="d-flex align-items-center gap-2 mt-2" style={{ fontWeight: 700, fontSize: '0.85rem', color: '#999' }}>
                      <MapPin size={14} /> Address
                    </h6>
                  </div>
                  <div className="col-12">
                    <input type="text" className="form-control" placeholder="House no., Street, Area"
                      value={profileForm.address.street}
                      onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, street: e.target.value } })}
                      style={{ borderRadius: '12px' }} />
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="City" value={profileForm.address.city}
                      onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, city: e.target.value } })}
                      style={{ borderRadius: '12px' }} />
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="State" value={profileForm.address.state}
                      onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, state: e.target.value } })}
                      style={{ borderRadius: '12px' }} />
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Pincode" value={profileForm.address.pincode}
                      onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, pincode: e.target.value } })}
                      style={{ borderRadius: '12px' }} />
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Country" value={profileForm.address.country}
                      onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, country: e.target.value } })}
                      style={{ borderRadius: '12px' }} />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn d-flex align-items-center gap-2" disabled={profileLoading}
                      style={{
                        background: 'linear-gradient(135deg, #C8A97E, #B8956A)', color: '#fff',
                        border: 'none', borderRadius: '12px', fontWeight: 700, padding: '0.7rem 1.5rem',
                      }}>
                      {profileLoading && <span className="spinner-border spinner-border-sm" />}
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        <div className="col-lg-5">
          {/* Password */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="card border-0 p-4 mb-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h5 className="d-flex align-items-center gap-2" style={{ fontWeight: 800, marginBottom: '1.5rem' }}>
                <Lock size={18} color="#C8A97E" /> Change Password
              </h5>
              <form onSubmit={handlePasswordChange}>
                {[
                  ['Current Password', 'oldPassword', pwdForm.oldPassword, showOldPwd, setShowOldPwd],
                  ['New Password', 'newPassword', pwdForm.newPassword, showNewPwd, setShowNewPwd],
                  ['Confirm Password', 'confirmPassword', pwdForm.confirmPassword, false, null],
                ].map(([label, name, value, show, setShow]) => (
                  <div key={name} className="mb-3">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>{label}</label>
                    <div className="position-relative">
                      <input
                        type={show ? 'text' : 'password'} className="form-control"
                        placeholder={name === 'newPassword' ? 'Min. 6 characters' : '••••••••'}
                        value={value}
                        onChange={(e) => setPwdForm({ ...pwdForm, [name]: e.target.value })}
                        required style={{ borderRadius: '12px', paddingRight: '2.5rem' }}
                      />
                      {setShow && (
                        <button type="button" className="btn position-absolute top-50 end-0 translate-middle-y p-0 me-3 border-0"
                          onClick={() => setShow(!show)} style={{ background: 'none' }}>
                          {show ? <EyeOff size={16} color="#999" /> : <Eye size={16} color="#999" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button type="submit" className="btn w-100" disabled={pwdLoading}
                  style={{ background: '#0a0a0a', color: '#fff', borderRadius: '12px', fontWeight: 700, padding: '0.75rem', border: 'none' }}>
                  {pwdLoading && <span className="spinner-border spinner-border-sm me-2" />}
                  Update Password
                </button>
              </form>
            </div>

            {/* Security Tips */}
            <div className="card border-0 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', background: '#f7f7f7' }}>
              <h6 className="d-flex align-items-center gap-2" style={{ fontWeight: 800, marginBottom: '0.75rem' }}>
                <ShieldCheck size={16} color="#C8A97E" /> Security Tips
              </h6>
              <ul className="list-unstyled mb-0">
                {['Use at least 6 characters', 'Mix letters, numbers & symbols', 'Never share your password', 'Change it regularly'].map((tip) => (
                  <li key={tip} className="mb-1 d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', color: '#555' }}>
                    <span style={{ color: '#34C759', fontWeight: 700 }}>✓</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
