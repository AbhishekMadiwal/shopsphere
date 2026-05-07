const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products (public) with filters, sort, pagination
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, brand, minPrice, maxPrice, search, sort, page = 1, limit = 10, inStock } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (inStock === 'true') query.stock = { $gt: 0 };

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { 'ratings.average': -1 };
    else if (sort === 'popular') sortOption = { sold: -1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('reviews.user', 'name avatar');
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (admin)
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const { name, description, price, originalPrice, category, brand, stock, tags } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    const tagsArr = tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [];

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      category,
      brand: brand || '',
      images,
      stock: Number(stock) || 0,
      tags: tagsArr,
    });

    await product.populate('category', 'name slug');
    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, description, price, originalPrice, category, brand, stock, tags, isActive, existingImages } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) return res.status(400).json({ success: false, message: 'Invalid category' });
      product.category = category;
    }
    if (brand !== undefined) product.brand = brand;
    if (stock !== undefined) product.stock = Number(stock);
    if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;
    if (tags !== undefined) {
      product.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    }

    // Merge existing images with new uploads
    let images = [];
    if (existingImages) {
      images = Array.isArray(existingImages) ? existingImages : [existingImages];
    }
    if (req.files && req.files.length > 0) {
      images = [...images, ...req.files.map((f) => `/uploads/${f.filename}`)];
    }
    if (images.length > 0) product.images = images;

    await product.save();
    await product.populate('category', 'name slug');
    res.json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product.isActive = false;
    await product.save();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review (authenticated customer)
// @route   POST /api/products/:id/review
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (!rating) {
      return res.status(400).json({ success: false, message: 'Rating is required' });
    }
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    product.reviews.push({ user: req.user._id, rating: Number(rating), comment: comment || '' });

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.ratings.average = parseFloat((totalRating / product.reviews.length).toFixed(1));
    product.ratings.count = product.reviews.length;

    await product.save();
    await product.populate('reviews.user', 'name avatar');
    res.status(201).json({ success: true, message: 'Review added successfully', data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories (public)
// @route   GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category (admin)
// @route   POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const { name, image } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });
    const category = await Category.create({ name, image: image || '' });
    res.status(201).json({ success: true, message: 'Category created', data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (admin)
// @route   PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category updated', data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (admin)
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview,
  getCategories, createCategory, updateCategory, deleteCategory,
};
