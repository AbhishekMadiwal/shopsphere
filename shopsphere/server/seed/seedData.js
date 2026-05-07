require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shopsphere');
  console.log('✅ MongoDB Connected for seeding');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // ─── USERS ───────────────────────────────────────────────
    const hashedAdmin = await bcrypt.hash('admin123', 12);
    const hashedTest  = await bcrypt.hash('test123', 12);

    const [admin, rahul, priya] = await User.insertMany([
      {
        name: 'Admin',
        email: 'admin@shopsphere.com',
        password: hashedAdmin,
        role: 'admin',
        phone: '9000000000',
        address: { street: '1 Admin Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', country: 'India' },
        isActive: true,
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul@test.com',
        password: hashedTest,
        role: 'customer',
        phone: '9111111111',
        address: { street: '12 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', country: 'India' },
        isActive: true,
      },
      {
        name: 'Priya Patel',
        email: 'priya@test.com',
        password: hashedTest,
        role: 'customer',
        phone: '9222222222',
        address: { street: '45 SG Highway', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015', country: 'India' },
        isActive: true,
      },
    ]);
    console.log('👤 Users seeded');

    // ─── CATEGORIES ──────────────────────────────────────────
    const categoryData = [
      { name: 'Electronics',     slug: 'electronics',      image: 'https://placehold.co/400x400?text=Electronics' },
      { name: 'Fashion',         slug: 'fashion',          image: 'https://placehold.co/400x400?text=Fashion' },
      { name: 'Home & Kitchen',  slug: 'home-kitchen',     image: 'https://placehold.co/400x400?text=Home+Kitchen' },
      { name: 'Books',           slug: 'books',            image: 'https://placehold.co/400x400?text=Books' },
      { name: 'Sports',          slug: 'sports',           image: 'https://placehold.co/400x400?text=Sports' },
      { name: 'Beauty',          slug: 'beauty',           image: 'https://placehold.co/400x400?text=Beauty' },
    ];
    const categories = await Category.insertMany(categoryData);
    const [electronics, fashion, homeKitchen, books, sports, beauty] = categories;
    console.log('📦 Categories seeded');

    // ─── PRODUCTS ─────────────────────────────────────────────
    const products = await Product.insertMany([
      // Electronics (5)
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'The ultimate Android experience with 200MP camera, S Pen, and Snapdragon 8 Gen 3 processor. 5000mAh battery with 45W fast charging.',
        price: 124999, originalPrice: 134999, category: electronics._id, brand: 'Samsung',
        images: ['https://placehold.co/400x400?text=Galaxy+S24+Ultra'],
        stock: 45, sold: 120, tags: ['smartphone', '5g', 'android', 'samsung'],
        ratings: { average: 4.7, count: 234 },
      },
      {
        name: 'Apple MacBook Air M3',
        description: '13-inch MacBook Air with Apple M3 chip, 16GB RAM, 512GB SSD. Up to 18 hours battery life.',
        price: 114900, originalPrice: 124900, category: electronics._id, brand: 'Apple',
        images: ['https://placehold.co/400x400?text=MacBook+Air+M3'],
        stock: 30, sold: 89, tags: ['laptop', 'apple', 'macbook', 'm3'],
        ratings: { average: 4.9, count: 178 },
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise cancelling headphones with 30-hour battery, multipoint connection, and LDAC support.',
        price: 26990, originalPrice: 34990, category: electronics._id, brand: 'Sony',
        images: ['https://placehold.co/400x400?text=Sony+WH1000XM5'],
        stock: 78, sold: 312, tags: ['headphones', 'noise-cancelling', 'wireless', 'sony'],
        ratings: { average: 4.8, count: 567 },
      },
      {
        name: 'LG 55-inch 4K OLED TV',
        description: '55-inch OLED evo display with α9 AI Processor 4K Gen6, Dolby Vision IQ and Dolby Atmos.',
        price: 89990, originalPrice: 109990, category: electronics._id, brand: 'LG',
        images: ['https://placehold.co/400x400?text=LG+OLED+TV'],
        stock: 15, sold: 45, tags: ['tv', 'oled', '4k', 'lg', 'smart-tv'],
        ratings: { average: 4.6, count: 89 },
      },
      {
        name: 'iPad Pro 12.9-inch M4',
        description: 'The ultimate iPad experience with M4 chip, Ultra Retina XDR display with ProMotion, and Apple Pencil Pro support.',
        price: 108900, originalPrice: 119900, category: electronics._id, brand: 'Apple',
        images: ['https://placehold.co/400x400?text=iPad+Pro+M4'],
        stock: 22, sold: 67, tags: ['tablet', 'ipad', 'apple', 'm4'],
        ratings: { average: 4.8, count: 134 },
      },
      // Fashion (4)
      {
        name: 'Levi\'s 501 Original Jeans',
        description: 'The original blue jean since 1873. Straight leg, button fly, sits at waist. Made from 100% cotton denim.',
        price: 3499, originalPrice: 4999, category: fashion._id, brand: 'Levi\'s',
        images: ['https://placehold.co/400x400?text=Levis+501+Jeans'],
        stock: 150, sold: 890, tags: ['jeans', 'denim', 'levis', 'men', 'casual'],
        ratings: { average: 4.5, count: 1234 },
      },
      {
        name: 'Nike Air Max 270',
        description: 'Inspired by the Air Max 180 and Air Huarache, the Nike Air Max 270 delivers a bold look and an incredibly comfortable ride.',
        price: 11995, originalPrice: 13995, category: fashion._id, brand: 'Nike',
        images: ['https://placehold.co/400x400?text=Nike+Air+Max+270'],
        stock: 65, sold: 445, tags: ['shoes', 'nike', 'sneakers', 'air-max', 'sports'],
        ratings: { average: 4.6, count: 678 },
      },
      {
        name: 'Zara Floral Midi Dress',
        description: 'Elegant floral print midi dress with V-neckline, puff sleeves, and flowy silhouette. Perfect for all occasions.',
        price: 3990, originalPrice: 5990, category: fashion._id, brand: 'Zara',
        images: ['https://placehold.co/400x400?text=Zara+Floral+Dress'],
        stock: 80, sold: 234, tags: ['dress', 'women', 'zara', 'floral', 'midi'],
        ratings: { average: 4.3, count: 345 },
      },
      {
        name: 'Ray-Ban Aviator Classic',
        description: 'The Ray-Ban Aviator Classic sunglasses are one of the most iconic eyewear styles in the world. Timeless design with UV protection.',
        price: 8490, originalPrice: 9990, category: fashion._id, brand: 'Ray-Ban',
        images: ['https://placehold.co/400x400?text=RayBan+Aviator'],
        stock: 55, sold: 189, tags: ['sunglasses', 'ray-ban', 'aviator', 'unisex'],
        ratings: { average: 4.7, count: 456 },
      },
      // Home & Kitchen (4)
      {
        name: 'Instant Pot Duo 7-in-1',
        description: '7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer. 6-quart capacity.',
        price: 8999, originalPrice: 11999, category: homeKitchen._id, brand: 'Instant Pot',
        images: ['https://placehold.co/400x400?text=Instant+Pot+Duo'],
        stock: 40, sold: 567, tags: ['pressure-cooker', 'kitchen', 'instant-pot', 'cooking'],
        ratings: { average: 4.7, count: 2345 },
      },
      {
        name: 'Dyson V15 Detect Vacuum',
        description: 'Most powerful Dyson cordless vacuum. Laser dust detection, piezo sensor counts and sizes dust. Up to 60 min run time.',
        price: 52900, originalPrice: 62900, category: homeKitchen._id, brand: 'Dyson',
        images: ['https://placehold.co/400x400?text=Dyson+V15+Vacuum'],
        stock: 25, sold: 78, tags: ['vacuum', 'dyson', 'cordless', 'home-cleaning'],
        ratings: { average: 4.5, count: 234 },
      },
      {
        name: 'IKEA KALLAX Shelf Unit',
        description: '4x4 KALLAX shelf unit in white. Perfect for books, plants and decorations. Fits in any room.',
        price: 7999, originalPrice: 9499, category: homeKitchen._id, brand: 'IKEA',
        images: ['https://placehold.co/400x400?text=IKEA+KALLAX+Shelf'],
        stock: 20, sold: 123, tags: ['shelf', 'storage', 'ikea', 'furniture', 'home'],
        ratings: { average: 4.4, count: 345 },
      },
      {
        name: 'Nespresso Vertuo Next Coffee Machine',
        description: 'Brew barista-quality coffee at home. Compatible with all Vertuo capsules. WiFi enabled for firmware updates.',
        price: 13990, originalPrice: 16990, category: homeKitchen._id, brand: 'Nespresso',
        images: ['https://placehold.co/400x400?text=Nespresso+Vertuo'],
        stock: 35, sold: 201, tags: ['coffee', 'nespresso', 'coffee-machine', 'kitchen'],
        ratings: { average: 4.6, count: 567 },
      },
      // Books (3)
      {
        name: 'Atomic Habits by James Clear',
        description: 'A revolutionary system to get 1% better every day. Learn how tiny changes in behaviour can lead to remarkable results.',
        price: 499, originalPrice: 699, category: books._id, brand: 'Penguin Random House',
        images: ['https://placehold.co/400x400?text=Atomic+Habits'],
        stock: 200, sold: 1567, tags: ['self-help', 'habits', 'productivity', 'james-clear'],
        ratings: { average: 4.9, count: 4567 },
      },
      {
        name: 'The Lean Startup by Eric Ries',
        description: 'How today\'s entrepreneurs use continuous innovation to create radically successful businesses.',
        price: 449, originalPrice: 599, category: books._id, brand: 'Crown Business',
        images: ['https://placehold.co/400x400?text=Lean+Startup'],
        stock: 150, sold: 789, tags: ['business', 'startup', 'entrepreneurship', 'eric-ries'],
        ratings: { average: 4.7, count: 2345 },
      },
      {
        name: 'Thinking, Fast and Slow',
        description: 'Daniel Kahneman\'s groundbreaking book on the two systems that drive the way we think.',
        price: 399, originalPrice: 549, category: books._id, brand: 'Farrar Straus Giroux',
        images: ['https://placehold.co/400x400?text=Thinking+Fast+Slow'],
        stock: 180, sold: 1023, tags: ['psychology', 'cognitive-science', 'decision-making', 'kahneman'],
        ratings: { average: 4.8, count: 3456 },
      },
      // Sports (2)
      {
        name: 'Decathlon Tarmak Basketball',
        description: 'Size 7 official regulation basketball. Suitable for indoor/outdoor use. Superior grip, excellent durability.',
        price: 1299, originalPrice: 1799, category: sports._id, brand: 'Decathlon',
        images: ['https://placehold.co/400x400?text=Tarmak+Basketball'],
        stock: 90, sold: 345, tags: ['basketball', 'sports', 'decathlon', 'outdoor'],
        ratings: { average: 4.4, count: 567 },
      },
      {
        name: 'Lifelong Gym Fitness Kit',
        description: 'Complete home gym set with 20kg adjustable dumbbells, resistance bands, push-up bars and exercise mat.',
        price: 4999, originalPrice: 7499, category: sports._id, brand: 'Lifelong',
        images: ['https://placehold.co/400x400?text=Gym+Fitness+Kit'],
        stock: 55, sold: 234, tags: ['gym', 'fitness', 'dumbbells', 'home-workout'],
        ratings: { average: 4.3, count: 456 },
      },
      // Beauty (2)
      {
        name: 'L\'Oreal Paris Revitalift Serum',
        description: '1.5% Pure Hyaluronic Acid + Vitamin C serum. Deeply hydrates, visibly plumps skin and reduces fine lines.',
        price: 849, originalPrice: 1299, category: beauty._id, brand: 'L\'Oreal',
        images: ['https://placehold.co/400x400?text=LOreal+Serum'],
        stock: 120, sold: 678, tags: ['serum', 'skincare', 'loreal', 'hyaluronic-acid'],
        ratings: { average: 4.5, count: 1234 },
      },
      {
        name: 'Maybelline Fit Me Foundation',
        description: 'Natural and soft-focus foundation that fits skin tone and texture. SPF 18. Available in 40 shades.',
        price: 499, originalPrice: 699, category: beauty._id, brand: 'Maybelline',
        images: ['https://placehold.co/400x400?text=Maybelline+Foundation'],
        stock: 95, sold: 890, tags: ['foundation', 'makeup', 'maybelline', 'beauty'],
        ratings: { average: 4.4, count: 2345 },
      },
    ]);
    console.log(`🛍️  ${products.length} Products seeded`);

    // ─── ORDERS ───────────────────────────────────────────────
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const orderDocs = [];

    // Rahul's orders
    orderDocs.push(
      {
        user: rahul._id,
        items: [
          { product: products[0]._id, name: products[0].name, image: products[0].images[0], price: products[0].price, quantity: 1 },
          { product: products[2]._id, name: products[2].name, image: products[2].images[0], price: products[2].price, quantity: 1 },
        ],
        shippingAddress: rahul.address,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Delivered',
        subtotal: products[0].price + products[2].price,
        shippingCharge: 0,
        discount: 0,
        totalAmount: products[0].price + products[2].price,
        statusHistory: [
          { status: 'Pending', note: 'Order placed' },
          { status: 'Processing', note: 'Payment confirmed' },
          { status: 'Shipped', note: 'Dispatched from warehouse' },
          { status: 'Delivered', note: 'Delivered successfully' },
        ],
        deliveredAt: new Date(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        user: rahul._id,
        items: [
          { product: products[5]._id, name: products[5].name, image: products[5].images[0], price: products[5].price, quantity: 2 },
        ],
        shippingAddress: rahul.address,
        paymentMethod: 'Online',
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
        subtotal: products[5].price * 2,
        shippingCharge: 0,
        discount: 0,
        totalAmount: products[5].price * 2,
        statusHistory: [
          { status: 'Pending', note: 'Order placed' },
          { status: 'Processing', note: 'Payment verified' },
          { status: 'Shipped', note: 'Out for delivery' },
        ],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        user: rahul._id,
        items: [
          { product: products[13]._id, name: products[13].name, image: products[13].images[0], price: products[13].price, quantity: 3 },
          { product: products[14]._id, name: products[14].name, image: products[14].images[0], price: products[14].price, quantity: 2 },
        ],
        shippingAddress: rahul.address,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Processing',
        subtotal: products[13].price * 3 + products[14].price * 2,
        shippingCharge: 0,
        discount: 0,
        totalAmount: products[13].price * 3 + products[14].price * 2,
        statusHistory: [
          { status: 'Pending', note: 'Order placed' },
          { status: 'Processing', note: 'Being prepared' },
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        user: rahul._id,
        items: [
          { product: products[9]._id, name: products[9].name, image: products[9].images[0], price: products[9].price, quantity: 1 },
        ],
        shippingAddress: rahul.address,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        subtotal: products[9].price,
        shippingCharge: 0,
        discount: 0,
        totalAmount: products[9].price,
        statusHistory: [{ status: 'Pending', note: 'Order placed' }],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        user: rahul._id,
        items: [
          { product: products[16]._id, name: products[16].name, image: products[16].images[0], price: products[16].price, quantity: 1 },
        ],
        shippingAddress: rahul.address,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Cancelled',
        subtotal: products[16].price,
        shippingCharge: 50,
        discount: 0,
        totalAmount: products[16].price + 50,
        statusHistory: [
          { status: 'Pending', note: 'Order placed' },
          { status: 'Cancelled', note: 'Cancelled by customer' },
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }
    );

    // Priya's orders
    orderDocs.push(
      {
        user: priya._id,
        items: [
          { product: products[1]._id, name: products[1].name, image: products[1].images[0], price: products[1].price, quantity: 1 },
        ],
        shippingAddress: priya.address,
        paymentMethod: 'Online',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        subtotal: products[1].price,
        shippingCharge: 0,
        discount: 0,
        totalAmount: products[1].price,
        statusHistory: [
          { status: 'Pending', note: 'Order placed' },
          { status: 'Processing', note: 'Payment confirmed' },
          { status: 'Shipped', note: 'In transit' },
          { status: 'Delivered', note: 'Delivered' },
        ],
        deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        user: priya._id,
        items: [
          { product: products[7]._id, name: products[7].name, image: products[7].images[0], price: products[7].price, quantity: 2 },
          { product: products[17]._id, name: products[17].name, image: products[17].images[0], price: products[17].price, quantity: 2 },
        ],
        shippingAddress: priya.address,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Shipped',
        subtotal: products[7].price * 2 + products[17].price * 2,
        shippingCharge: 0,
        discount: 0,
        totalAmount: products[7].price * 2 + products[17].price * 2,
        statusHistory: [
          { status: 'Pending', note: 'Order placed' },
          { status: 'Processing', note: 'Confirmed' },
          { status: 'Shipped', note: 'Out for delivery' },
        ],
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        user: priya._id,
        items: [
          { product: products[18]._id, name: products[18].name, image: products[18].images[0], price: products[18].price, quantity: 1 },
          { product: products[19]._id, name: products[19].name, image: products[19].images[0], price: products[19].price, quantity: 2 },
        ],
        shippingAddress: priya.address,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Processing',
        subtotal: products[18].price + products[19].price * 2,
        shippingCharge: 50,
        discount: 0,
        totalAmount: products[18].price + products[19].price * 2 + 50,
        statusHistory: [
          { status: 'Pending', note: 'Order placed' },
          { status: 'Processing', note: 'Being packaged' },
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        user: priya._id,
        items: [
          { product: products[4]._id, name: products[4].name, image: products[4].images[0], price: products[4].price, quantity: 1 },
        ],
        shippingAddress: priya.address,
        paymentMethod: 'Online',
        paymentStatus: 'Paid',
        orderStatus: 'Pending',
        subtotal: products[4].price,
        shippingCharge: 0,
        discount: 0,
        totalAmount: products[4].price,
        statusHistory: [{ status: 'Pending', note: 'Order placed' }],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        user: priya._id,
        items: [
          { product: products[12]._id, name: products[12].name, image: products[12].images[0], price: products[12].price, quantity: 1 },
          { product: products[15]._id, name: products[15].name, image: products[15].images[0], price: products[15].price, quantity: 1 },
        ],
        shippingAddress: priya.address,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Delivered',
        subtotal: products[12].price + products[15].price,
        shippingCharge: 0,
        discount: 0,
        totalAmount: products[12].price + products[15].price,
        statusHistory: [
          { status: 'Pending', note: 'Order placed' },
          { status: 'Processing', note: 'Confirmed' },
          { status: 'Shipped', note: 'In transit' },
          { status: 'Delivered', note: 'Delivered' },
        ],
        deliveredAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      }
    );

    // Insert orders with auto orderNumber
    for (const orderData of orderDocs) {
      const order = new Order(orderData);
      await order.save();
    }

    console.log(`📋 ${orderDocs.length} Orders seeded`);
    console.log('\n✅ Database seeded successfully!\n');
    console.log('═══════════════════════════════════');
    console.log('  LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════');
    console.log('  Admin:    admin@shopsphere.com / admin123');
    console.log('  Customer: rahul@test.com / test123');
    console.log('  Customer: priya@test.com / test123');
    console.log('═══════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
