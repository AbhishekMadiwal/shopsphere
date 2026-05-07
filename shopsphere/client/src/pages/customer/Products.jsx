import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import { SkeletonCard } from '../../components/Loader';
import { SlidersHorizontal, X, Search, Package } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    inStock: searchParams.get('inStock') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchProducts = useCallback(async (f) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (f.search) params.set('search', f.search);
      if (f.category) params.set('category', f.category);
      if (f.brand) params.set('brand', f.brand);
      if (f.minPrice) params.set('minPrice', f.minPrice);
      if (f.maxPrice) params.set('maxPrice', f.maxPrice);
      if (f.sort) params.set('sort', f.sort);
      if (f.inStock) params.set('inStock', f.inStock);
      params.set('page', f.page || 1);
      params.set('limit', 12);

      const { data } = await API.get(`/products?${params}`);
      setProducts(data.data.products);
      setPagination(data.data.pagination);
      setSearchParams(params);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]);

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data.data)).catch(() => {});
  }, []);

  useEffect(() => { fetchProducts(filters); }, [filters.page, filters.category, filters.sort, filters.inStock]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts({ ...filters, page: 1 });
  };

  const clearFilters = () => {
    const reset = { search: '', category: '', brand: '', minPrice: '', maxPrice: '', sort: '', inStock: '', page: 1 };
    setFilters(reset);
    fetchProducts(reset);
  };

  const hasFilters = filters.search || filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.inStock;

  /* Filter Sidebar Content */
  const FilterContent = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="d-flex align-items-center gap-2 mb-0" style={{ fontWeight: 800, fontSize: '1rem' }}>
          <SlidersHorizontal size={18} /> Filters
        </h5>
        {hasFilters && (
          <button className="btn btn-sm p-0 border-0" onClick={clearFilters}
            style={{ color: '#FF3B30', fontWeight: 600, fontSize: '0.75rem', background: 'none' }}>
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4">
        <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', marginBottom: '0.4rem', display: 'block' }}>
          Search
        </label>
        <div className="d-flex gap-1">
          <div className="flex-grow-1 position-relative">
            <Search size={14} color="#999" className="position-absolute" style={{ top: '50%', left: 12, transform: 'translateY(-50%)' }} />
            <input
              type="text" className="form-control form-control-sm" placeholder="Product name..."
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
              style={{ paddingLeft: '2.2rem', borderRadius: '10px', fontSize: '0.8rem' }}
            />
          </div>
          <button className="btn btn-sm" type="submit"
            style={{ background: '#0a0a0a', color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '0.75rem', padding: '0 0.75rem' }}>
            Go
          </button>
        </div>
      </form>

      {/* Category */}
      <div className="mb-4">
        <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', marginBottom: '0.5rem', display: 'block' }}>
          Category
        </label>
        <div className="d-flex flex-column gap-1">
          <button
            className={`btn btn-sm text-start ${!filters.category ? 'active-filter' : ''}`}
            onClick={() => handleFilterChange('category', '')}
            style={{
              background: !filters.category ? 'rgba(200,169,126,0.12)' : 'transparent',
              color: !filters.category ? '#C8A97E' : '#555',
              border: !filters.category ? '1px solid rgba(200,169,126,0.25)' : '1px solid transparent',
              borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, padding: '0.45rem 0.75rem',
            }}>
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className="btn btn-sm text-start"
              onClick={() => handleFilterChange('category', filters.category === cat._id ? '' : cat._id)}
              style={{
                background: filters.category === cat._id ? 'rgba(200,169,126,0.12)' : 'transparent',
                color: filters.category === cat._id ? '#C8A97E' : '#555',
                border: filters.category === cat._id ? '1px solid rgba(200,169,126,0.25)' : '1px solid transparent',
                borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, padding: '0.45rem 0.75rem',
              }}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="mb-4">
        <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', marginBottom: '0.4rem', display: 'block' }}>
          Brand
        </label>
        <input
          type="text" className="form-control form-control-sm"
          placeholder="Filter by brand..." value={filters.brand}
          onChange={(e) => setFilters((p) => ({ ...p, brand: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && fetchProducts({ ...filters, brand: e.target.value, page: 1 })}
          style={{ borderRadius: '10px', fontSize: '0.8rem' }}
        />
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', marginBottom: '0.4rem', display: 'block' }}>
          Price Range (₹)
        </label>
        <div className="d-flex gap-2">
          <input type="number" className="form-control form-control-sm" placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
            min="0" style={{ borderRadius: '10px', fontSize: '0.8rem' }} />
          <input type="number" className="form-control form-control-sm" placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
            min="0" style={{ borderRadius: '10px', fontSize: '0.8rem' }} />
        </div>
        <button className="btn btn-sm w-100 mt-2"
          onClick={() => fetchProducts({ ...filters, page: 1 })}
          style={{ border: '1.5px solid #e0e0e0', borderRadius: '10px', fontWeight: 600, fontSize: '0.75rem', color: '#555' }}>
          Apply Price
        </button>
      </div>

      {/* In Stock */}
      <div className="mb-3">
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="inStock"
            checked={filters.inStock === 'true'}
            onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : '')}
          />
          <label className="form-check-label" htmlFor="inStock"
            style={{ fontWeight: 600, fontSize: '0.8rem' }}>
            In Stock Only
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        {/* ─── SIDEBAR FILTERS (Desktop) ──────────────────── */}
        <div className="col-lg-3 col-xl-2 d-none d-lg-block">
          <div className="card border-0 sticky-top p-3"
            style={{ top: '80px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <FilterContent />
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="d-lg-none position-fixed bottom-0 start-0 end-0 p-3" style={{ zIndex: 99 }}>
          <button className="btn w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => setShowMobileFilters(true)}
            style={{
              background: '#0a0a0a', color: '#fff', borderRadius: '14px',
              padding: '0.8rem', fontWeight: 700, fontSize: '0.85rem',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)', border: 'none',
            }}>
            <SlidersHorizontal size={18} /> Filters {hasFilters && `(Active)`}
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-lg-none" style={{ zIndex: 200, background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowMobileFilters(false)}>
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="h-100 bg-white p-4"
              style={{ width: '85%', maxWidth: 320, overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ fontWeight: 800 }}>Filters</h5>
                <button className="btn p-0 border-0" onClick={() => setShowMobileFilters(false)}>
                  <X size={20} />
                </button>
              </div>
              <FilterContent />
              <button className="btn w-100 mt-3"
                onClick={() => { fetchProducts({ ...filters, page: 1 }); setShowMobileFilters(false); }}
                style={{ background: '#0a0a0a', color: '#fff', borderRadius: '12px', fontWeight: 700, border: 'none', padding: '0.75rem' }}>
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}

        {/* ─── MAIN CONTENT ────────────────────────────────── */}
        <div className="col-lg-9 col-xl-10">
          {/* Top bar */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                {filters.search ? `Results for "${filters.search}"` : filters.category ? 'Category Products' : 'All Products'}
              </h4>
              <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: 0 }}>
                {loading ? 'Loading...' : `${pagination.total} products found`}
              </p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <label style={{ fontWeight: 600, fontSize: '0.8rem', color: '#999', whiteSpace: 'nowrap' }}>Sort:</label>
              <select
                className="form-select form-select-sm"
                style={{ minWidth: 170, borderRadius: '10px', fontSize: '0.8rem' }}
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {filters.search && (
                <span className="d-inline-flex align-items-center gap-1"
                  style={{ background: 'rgba(200,169,126,0.1)', borderRadius: '50px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: '#C8A97E' }}>
                  Search: {filters.search}
                  <button className="btn p-0 border-0 ms-1" onClick={() => handleFilterChange('search', '')}
                    style={{ background: 'none', lineHeight: 1 }}>
                    <X size={12} color="#C8A97E" />
                  </button>
                </span>
              )}
              {filters.category && categories.find(c => c._id === filters.category) && (
                <span className="d-inline-flex align-items-center gap-1"
                  style={{ background: 'rgba(200,169,126,0.1)', borderRadius: '50px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: '#C8A97E' }}>
                  {categories.find(c => c._id === filters.category)?.name}
                  <button className="btn p-0 border-0 ms-1" onClick={() => handleFilterChange('category', '')}
                    style={{ background: 'none', lineHeight: 1 }}>
                    <X size={12} color="#C8A97E" />
                  </button>
                </span>
              )}
              {filters.brand && (
                <span className="d-inline-flex align-items-center gap-1"
                  style={{ background: 'rgba(200,169,126,0.1)', borderRadius: '50px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: '#C8A97E' }}>
                  Brand: {filters.brand}
                  <button className="btn p-0 border-0 ms-1" onClick={() => handleFilterChange('brand', '')}
                    style={{ background: 'none', lineHeight: 1 }}>
                    <X size={12} color="#C8A97E" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="row g-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3 col-xl-3"><SkeletonCard /></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-5"
            >
              <div className="d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(200,169,126,0.1)' }}>
                <Package size={36} color="#C8A97E" />
              </div>
              <h4 style={{ fontWeight: 800 }}>No products found</h4>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Try adjusting your filters or search terms</p>
              <button className="btn" onClick={clearFilters}
                style={{
                  background: '#0a0a0a', color: '#fff', borderRadius: '12px',
                  fontWeight: 700, padding: '0.6rem 1.5rem', fontSize: '0.85rem', border: 'none',
                }}>
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <>
              <div className="row g-4">
                {products.map((p, i) => (
                  <div key={p._id} className="col-6 col-md-4 col-lg-3 col-xl-3">
                    <ProductCard product={p} index={i} />
                  </div>
                ))}
              </div>
              <div className="mt-4 mb-5 mb-lg-0">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
