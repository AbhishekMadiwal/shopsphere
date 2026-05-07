import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import { ArrowLeft, Upload, X, ImagePlus } from 'lucide-react';

const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [form, setForm] = useState({
    name: '', description: '', price: '', originalPrice: '',
    category: '', brand: '', stock: '', tags: '', isActive: true,
  });

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data.data)).catch(() => {});
    if (isEdit) {
      API.get(`/products/${id}`)
        .then(({ data }) => {
          const p = data.data;
          setForm({
            name: p.name || '', description: p.description || '',
            price: p.price || '', originalPrice: p.originalPrice || '',
            category: p.category?._id || '', brand: p.brand || '',
            stock: p.stock || '', tags: p.tags?.join(', ') || '',
            isActive: p.isActive !== undefined ? p.isActive : true,
          });
          setExistingImages(p.images || []);
        })
        .catch(() => { toast.error('Failed to load product'); navigate('/admin/products'); })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 5) { toast.error('Maximum 5 images allowed'); return; }
    setNewImages((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 5) { toast.error('Maximum 5 images allowed'); return; }
    setNewImages((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const removeExistingImage = (idx) => setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  const removeNewImage = (idx) => {
    URL.revokeObjectURL(previewUrls[idx]);
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.category || form.stock === '') {
      toast.error('Please fill all required fields'); return;
    }
    try {
      setSaving(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      existingImages.forEach((img) => formData.append('existingImages', img));
      newImages.forEach((img) => formData.append('images', img));

      if (isEdit) {
        await API.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated successfully!');
      } else {
        await API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created successfully!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading product..." />;

  return (
    <div className="container-fluid py-4 px-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="d-flex align-items-center gap-3 mb-4">
        <button className="btn d-flex align-items-center gap-1" onClick={() => navigate('/admin/products')}
          style={{ border: '1.5px solid #e0e0e0', borderRadius: '10px', fontWeight: 600, fontSize: '0.8rem', color: '#555', padding: '0.5rem 1rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.15rem' }}>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <p style={{ color: '#999', fontSize: '0.8rem', marginBottom: 0 }}>{isEdit ? 'Update product details' : 'Create a new product listing'}</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Basic Info */}
            <div className="card border-0 mb-4 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h6 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>Basic Information</h6>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Product Name *</label>
                  <input type="text" className="form-control form-control-lg" name="name"
                    placeholder="e.g. Samsung Galaxy S24 Ultra"
                    value={form.name} onChange={handleChange} required style={{ borderRadius: '12px' }} />
                </div>
                <div className="col-12">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Description *</label>
                  <textarea className="form-control" name="description" rows={5}
                    placeholder="Detailed product description..."
                    value={form.description} onChange={handleChange} required style={{ borderRadius: '12px' }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Category *</label>
                  <select className="form-select" name="category"
                    value={form.category} onChange={handleChange} required style={{ borderRadius: '12px' }}>
                    <option value="">Select Category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Brand</label>
                  <input type="text" className="form-control" name="brand"
                    placeholder="e.g. Samsung, Apple, Nike"
                    value={form.brand} onChange={handleChange} style={{ borderRadius: '12px' }} />
                </div>
                <div className="col-md-4">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Selling Price (₹) *</label>
                  <input type="number" className="form-control" name="price"
                    placeholder="0.00" min="0" step="0.01"
                    value={form.price} onChange={handleChange} required style={{ borderRadius: '12px' }} />
                </div>
                <div className="col-md-4">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Original Price (₹)</label>
                  <input type="number" className="form-control" name="originalPrice"
                    placeholder="MRP" min="0" step="0.01"
                    value={form.originalPrice} onChange={handleChange} style={{ borderRadius: '12px' }} />
                  <small style={{ color: '#999', fontSize: '0.7rem' }}>For showing discount %</small>
                </div>
                <div className="col-md-4">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Stock Quantity *</label>
                  <input type="number" className="form-control" name="stock"
                    placeholder="0" min="0"
                    value={form.stock} onChange={handleChange} required style={{ borderRadius: '12px' }} />
                </div>
                <div className="col-12">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Tags</label>
                  <input type="text" className="form-control" name="tags"
                    placeholder="e.g. smartphone, 5g, android (comma separated)"
                    value={form.tags} onChange={handleChange} style={{ borderRadius: '12px' }} />
                  <small style={{ color: '#999', fontSize: '0.7rem' }}>Separate tags with commas</small>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="card border-0 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h6 style={{ fontWeight: 800, marginBottom: '0.25rem' }}>Product Images</h6>
              <p style={{ color: '#999', fontSize: '0.8rem', marginBottom: '1rem' }}>Upload up to 5 images. First image will be the main image.</p>

              <div className="p-4 text-center mb-3"
                style={{
                  border: '2px dashed rgba(200,169,126,0.3)',
                  borderRadius: '16px', cursor: 'pointer',
                  background: 'rgba(200,169,126,0.03)',
                  transition: 'all 0.3s',
                }}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('imageInput').click()}>
                <ImagePlus size={36} color="#C8A97E" className="mb-2" />
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Drag & drop images here</p>
                <p style={{ color: '#999', fontSize: '0.8rem', marginBottom: '0.25rem' }}>or click to browse</p>
                <p style={{ color: '#bbb', fontSize: '0.7rem' }}>Supported: JPEG, PNG, WebP — Max 5MB each</p>
                <input type="file" id="imageInput" multiple accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="d-none" onChange={handleImageSelect} />
              </div>

              {(existingImages.length > 0 || previewUrls.length > 0) && (
                <div className="d-flex flex-wrap gap-3">
                  {existingImages.map((img, idx) => (
                    <div key={`existing-${idx}`} className="position-relative">
                      <img
                        src={img.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL}${img}` : img}
                        alt={`Product ${idx + 1}`}
                        style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: '12px', border: '2px solid #e0e0e0' }}
                        onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=IMG'; }}
                      />
                      {idx === 0 && (
                        <span className="position-absolute badge" style={{
                          top: 4, left: 4, background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                          color: '#fff', fontSize: '0.55rem', borderRadius: '6px',
                        }}>Main</span>
                      )}
                      <button type="button" className="position-absolute btn p-0 d-flex align-items-center justify-content-center"
                        style={{ top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: '#FF3B30', border: '2px solid #fff', color: '#fff', fontSize: '0.6rem' }}
                        onClick={() => removeExistingImage(idx)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {previewUrls.map((url, idx) => (
                    <div key={`new-${idx}`} className="position-relative">
                      <img src={url} alt={`New ${idx + 1}`}
                        style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: '12px', border: '2px solid #C8A97E' }} />
                      <span className="position-absolute badge" style={{
                        top: 4, left: 4, background: '#007AFF', color: '#fff', fontSize: '0.55rem', borderRadius: '6px',
                      }}>New</span>
                      <button type="button" className="position-absolute btn p-0 d-flex align-items-center justify-content-center"
                        style={{ top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: '#FF3B30', border: '2px solid #fff', color: '#fff', fontSize: '0.6rem' }}
                        onClick={() => removeNewImage(idx)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '80px' }}>
              {/* Status */}
              <div className="card border-0 mb-3 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <h6 style={{ fontWeight: 800, marginBottom: '1rem' }}>Status</h6>
                <div className="form-check form-switch">
                  <input type="checkbox" className="form-check-input" id="isActive" name="isActive" role="switch"
                    checked={form.isActive} onChange={handleChange} style={{ width: '3em', height: '1.5em' }} />
                  <label className="form-check-label ms-2" htmlFor="isActive"
                    style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {form.isActive ? <span style={{ color: '#34C759' }}>Active (Visible to customers)</span> : <span style={{ color: '#999' }}>Inactive (Hidden)</span>}
                  </label>
                </div>
              </div>

              {/* Price Preview */}
              {form.price && (
                <div className="card border-0 mb-3 p-4" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', background: '#f7f7f7' }}>
                  <h6 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Price Preview</h6>
                  <div className="d-flex align-items-baseline gap-2 flex-wrap">
                    <span style={{ fontWeight: 900, fontSize: '1.5rem' }}>₹{Number(form.price).toLocaleString('en-IN')}</span>
                    {form.originalPrice && Number(form.originalPrice) > Number(form.price) && (
                      <>
                        <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.9rem' }}>
                          ₹{Number(form.originalPrice).toLocaleString('en-IN')}
                        </span>
                        <span style={{
                          background: 'rgba(52,199,89,0.1)', color: '#34C759',
                          fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '50px',
                        }}>
                          -{Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="card border-0 p-4 d-flex flex-column gap-3" style={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <button type="submit" className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                  disabled={saving}
                  style={{
                    background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
                    color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 700,
                  }}>
                  {saving ? <><span className="spinner-border spinner-border-sm" /> Saving...</> : (isEdit ? 'Update Product' : 'Create Product')}
                </button>
                <button type="button" className="btn w-100"
                  onClick={() => navigate('/admin/products')}
                  style={{ border: '1.5px solid #e0e0e0', borderRadius: '14px', fontWeight: 600, color: '#555' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;
