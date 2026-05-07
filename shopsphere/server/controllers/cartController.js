const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to calculate total
const calcTotal = (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price stock isActive');
    if (!cart) {
      cart = { user: req.user._id, items: [], totalAmount: 0 };
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'Product ID is required' });

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.stock < 1) {
      return res.status(400).json({ success: false, message: 'Product is out of stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], totalAmount: 0 });
    }

    const existingItem = cart.items.find((i) => i.product.toString() === productId);
    const qty = parseInt(quantity);

    if (existingItem) {
      const newQty = existingItem.quantity + qty;
      if (newQty > product.stock) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} units available` });
      }
      existingItem.quantity = newQty;
      existingItem.price = product.price;
    } else {
      if (qty > product.stock) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} units available` });
      }
      cart.items.push({ product: productId, quantity: qty, price: product.price });
    }

    cart.totalAmount = calcTotal(cart.items);
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.product', 'name images price stock isActive');

    res.json({ success: true, message: 'Item added to cart', data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
    }

    const qty = parseInt(quantity);
    if (qty < 1) return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (qty > product.stock) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} units available` });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

    item.quantity = qty;
    item.price = product.price;
    cart.totalAmount = calcTotal(cart.items);
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.product', 'name images price stock isActive');

    res.json({ success: true, message: 'Cart updated', data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    cart.totalAmount = calcTotal(cart.items);
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.product', 'name images price stock isActive');

    res.json({ success: true, message: 'Item removed from cart', data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = [];
    cart.totalAmount = 0;
    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ success: true, message: 'Cart cleared', data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
