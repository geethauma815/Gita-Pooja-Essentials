const { Product } = require('../models');

// Default products to seed the database
const defaultProducts = [
  {
    name: "Complete Diwali Lakshmi Pooja Kit",
    price: 1499,
    description: "All-in-one sacred kit containing 11 clay diyas, pure mustard oil, cotton wicks, haldi-kumkum, ganga jal, premium agarbatti, camphor, fresh marigold garlands, mango leaves, and a red altar cloth. Includes a step-by-step guidebook.",
    images: ["/pooja.png"],
    category: "kit-combo",
    inventory: 150,
    region: "all",
    rating: 4.8
  },
  {
    name: "Satyanarayana Vratham Premium Combo Kit",
    price: 2499,
    description: "Premium Vedic kit containing a wooden Peetham backdrop, copper Kalash, whole husked coconut, betel leaves, mixed garlands, cow ghee, Tulsi leaves, and pre-mixed Rava Prasad ingredients. Comes with the complete Katha script.",
    images: ["/pooja2.png"],
    category: "kit-combo",
    inventory: 85,
    region: "all",
    rating: 4.9
  },
  {
    name: "Eco-Friendly Ganesh Chaturthi Idol & Pooja Kit",
    price: 1799,
    description: "A 9-inch eco-friendly clay Ganesha idol that dissolves in water. The kit includes 21 blades of Durva grass, red Hibiscus flowers, a box of 11 fresh modaks, sandalwood paste, sacred janeu thread, and dynamic aarti lyrics.",
    images: ["/ganesh.png"],
    category: "kit-combo",
    inventory: 200,
    region: "all",
    rating: 4.7
  },
  {
    name: "Authentic Ganga Jal & Bhimseni Camphor Pack",
    price: 199,
    description: "100% pure Gangotri Ganga Jal (200ml) paired with 100g of original non-synthetic Bhimseni Camphor tablets for a divine aromatic smoke during aarti.",
    images: ["https://images.unsplash.com/photo-1609137144813-979401bf26e7?w=800&auto=format&fit=crop&q=60"],
    category: "pooja-item",
    inventory: 500,
    region: "all",
    rating: 4.6
  },
  {
    name: "Handcrafted Brass Pooja Thali Set (5-Piece)",
    price: 899,
    description: "Beautifully carved solid brass plate featuring a small diya holder, incense stand, bell, and haldi-kumkum containers. Built to last generations.",
    images: ["https://images.unsplash.com/photo-1608976451634-118e9a263152?w=800&auto=format&fit=crop&q=60"],
    category: "utensil",
    inventory: 120,
    region: "all",
    rating: 4.9
  },
  {
    name: "Organic Rangoli Colors (10 Vibrant Shades)",
    price: 349,
    description: "Skin-friendly, organic rangoli powder set derived from corn starch and natural flower extracts. Leaves no permanent stains.",
    images: ["/pooja3.png"],
    category: "decor",
    inventory: 300,
    region: "all",
    rating: 4.5
  },
  {
    name: "Telugu Tradition Ugadi Pachadi Ready-mix",
    price: 149,
    description: "Authentic mix containing raw mango bits, neem flowers, tamarind pulp, jaggery, black pepper, and salt, representing the six tastes of life for Ugadi.",
    images: ["https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=800&auto=format&fit=crop&q=60"],
    category: "prasad",
    inventory: 400,
    region: "telugu",
    rating: 4.8
  },
  {
    name: "Tamil Tradition Karthigai Deepam Terracotta Lamps",
    price: 249,
    description: "Set of 9 traditionally baked terracotta clay oil lamps, custom crafted by local potters in Tamil Nadu for Karthigai Deepam.",
    images: ["https://images.unsplash.com/photo-1605152276897-4f618f831968?w=800&auto=format&fit=crop&q=60"],
    category: "pooja-item",
    inventory: 180,
    region: "tamil",
    rating: 4.7
  }
];

// Fetch all products with filter support
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, region } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (region && region !== 'all') {
      // Return items matching either their specific region or 'all'
      query.region = { $in: [region, 'all'] };
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let products = await Product.find(query);
    if (products.length === 0 && !category && !search && (!region || region === 'all')) {
      console.log("No products found in DB. Seeding initial products...");
      await Product.insertMany(defaultProducts);
      products = await Product.find(query);
    }
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

// Fetch a single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product details' });
  }
};

// Create a new product (vendor or admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, images, category, inventory, region } = req.body;
    const newProduct = new Product({
      name,
      price,
      description,
      images: images || [],
      category,
      inventory: inventory || 10,
      region: region || 'all',
      vendorId: req.user.id
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating product' });
  }
};

// Update product inventory or details
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the vendor or an admin
    if (product.vendorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product' });
  }
};
