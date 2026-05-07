import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import { Plus, Search, Eye, Edit, Trash2, Star, Package } from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: '', category: '', page: 1 });
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async (f = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (f.search) params.set('search', f.search);
      if (f.category) params.set('category', f.category);
      params.set('page', f.page);
      params.set('limit', 12);
      const { data } = await API.get(`/products?${params}`);
      setProducts(data.data.products);
      setPagination(data.data.pagination);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data.data)).catch(() => {});
    fetchProducts();
  }, []);

  useEffect(() => { fetchProducts(filters); }, [filters.page, filters.category]);

  const handleSearch = (e) => { e.preventDefault(); fetchProducts({ ...filters, page: 1 }); };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action will deactivate the product.`)) return;
    try {
      setDeleting(id);
      await API.delete(`/products/${id}`);
      toast.success(`"${name}" deleted successfully`);
      fetchProducts(filters);
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="container-fluid py-4 px-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.25rem' }}>Manage Products</h2>
          <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: 0 }}>{pagination.total} total products</p>
        </div>
        <Link to="/admin/products/add" className="btn d-flex align-items-center gap-1"
          style={{ background: 'linear-gradient(135deg, #C8A97E, #B8956A)', color: '#fff', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', border: 'none', padding: '0.7rem 1.5rem' }}>
          <Plus size={16} /> Add New Product
        </Link>
      </motion.div>

      {/* Filters */}
      <div className="card border-0 mb-4 p-3" style={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
        <form onSubmit={handleSearch} className="row g-3 align-items-end">
          <div className="col-md-5">
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', marginBottom: '0.3rem', display: 'block' }}>Search</label>
            <div className="position-relative">
              <Search size={14} color="#999" className="position-absolute" style={{ top: '50%', left: 12, transform: 'translateY(-50%)' }} />
              <input type="text" className="form-control" placeholder="Product name, brand..."
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                style={{ paddingLeft: '2.2rem', borderRadius: '10px' }} />
            </div>
          </div>
          <div className="col-md-4">
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', marginBottom: '0.3rem', display: 'block' }}>Category</label>
            <select className="form-select" value={filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value, page: 1 }))}
              style={{ borderRadius: '10px' }}>
              <option value="">All Categories</option>
              {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
            </select>
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button type="submit" className="btn flex-fill"
              style={{ background: '#0a0a0a', color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', border: 'none' }}>
              Search
            </button>
            <button type="button" className="btn"
              onClick={() => { setFilters({ search: '', category: '', page: 1 }); fetchProducts({ search: '', category: '', page: 1 }); }}
              style={{ border: '1.5px solid #e0e0e0', borderRadius: '10px', fontWeight: 600, fontSize: '0.8rem', color: '#555' }}>
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Loading products..." />
      ) : products.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-5">
          <div className="d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(200,169,126,0.1)' }}>
            <Package size={36} color="#C8A97E" />
          </div>
          <h4 style={{ fontWeight: 800 }}>No products found</h4>
          <Link to="/admin/products/add" className="btn mt-2"
            style={{ background: 'linear-gradient(135deg, #C8A97E, #B8956A)', color: '#fff', borderRadius: '12px', fontWeight: 700, border: 'none', padding: '0.7rem 1.5rem' }}>
            Add Your First Product
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="card border-0" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Sold</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-4">
                        <div className="d-flex align-items-center gap-3">
                          <img src={product.images?.[0] || `https://placehold.co/50x50?text=P`}
                            alt={product.name}
                            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '10px', background: '#f5f5f5' }}
                            onError={(e) => { e.target.src = 'https://placehold.co/50x50?text=P'; }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.8rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {product.name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#999' }}>{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td><span style={{ background: '#f5f5f5', borderRadius: '8px', padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 600 }}>{product.category?.name}</span></td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>₹{product.price?.toLocaleString('en-IN')}</div>
                        {product.originalPrice > product.price && (
                          <div style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.7rem' }}>₹{product.originalPrice?.toLocaleString('en-IN')}</div>
                        )}
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 700,
                          color: product.stock === 0 ? '#FF3B30' : product.stock < 10 ? '#FF9500' : '#34C759',
                        }}>
                          {product.stock}
                        </span>
                      </td>
                      <td style={{ color: '#999', fontSize: '0.8rem' }}>{product.sold || 0}</td>
                      <td>
                        <span className="d-flex align-items-center gap-1">
                          <Star size={12} fill="#C8A97E" color="#C8A97E" />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{product.ratings?.average?.toFixed(1) || '0.0'}</span>
                          <span style={{ fontSize: '0.65rem', color: '#999' }}>({product.ratings?.count || 0})</span>
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '50px',
                          background: product.isActive ? 'rgba(52,199,89,0.1)' : 'rgba(0,0,0,0.05)',
                          color: product.isActive ? '#34C759' : '#999',
                        }}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1 justify-content-center">
                          <Link to={`/products/${product._id}`} target="_blank"
                            className="btn btn-sm p-0 d-flex align-items-center justify-content-center"
                            style={{ width: 32, height: 32, borderRadius: '8px', border: '1.5px solid #e0e0e0', background: 'transparent' }}
                            title="Preview">
                            <Eye size={14} color="#555" />
                          </Link>
                          <button className="btn btn-sm p-0 d-flex align-items-center justify-content-center"
                            onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                            style={{ width: 32, height: 32, borderRadius: '8px', border: '1.5px solid #e0e0e0', background: 'transparent' }}
                            title="Edit">
                            <Edit size={14} color="#555" />
                          </button>
                          <button className="btn btn-sm p-0 d-flex align-items-center justify-content-center"
                            onClick={() => handleDelete(product._id, product.name)}
                            disabled={deleting === product._id}
                            style={{ width: 32, height: 32, borderRadius: '8px', border: '1.5px solid rgba(255,59,48,0.2)', background: 'transparent' }}
                            title="Delete">
                            {deleting === product._id ? <span className="spinner-border spinner-border-sm" /> : <Trash2 size={14} color="#FF3B30" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4">
            <Pagination currentPage={pagination.page} totalPages={pagination.pages}
              onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))} />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProducts;
