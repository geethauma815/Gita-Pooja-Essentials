const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const apiRouter = require('./routes');
const { Product, Ritual } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,       // Set this in Render dashboard to your Vercel URL
  'https://gita-pooja-essentials.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }
    // Also allow any vercel.app subdomain (preview deployments)
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for now — tighten after confirming URLs
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Mount Routes
app.use('/api', apiRouter);

// Database Connection & Pre-seeding
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pooja-platform';

mongoose.set('bufferCommands', false);
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected successfully!');
    
    // Trigger pre-seeding directly on startup for smoother local testing
    try {
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        console.log("Pre-seeding products list...");
        const response = await fetch(`http://localhost:${PORT}/api/products`);
        if (response.ok) console.log("Products seeded successfully.");
      }
      
      const ritualCount = await Ritual.countDocuments();
      if (ritualCount === 0) {
        console.log("Pre-seeding rituals list...");
        const response = await fetch(`http://localhost:${PORT}/api/rituals`);
        if (response.ok) {
          // Link product kits to rituals
          const products = await Product.find({ category: 'kit-combo' });
          const rituals = await Ritual.find();
          for (const ritual of rituals) {
            const matchingProduct = products.find(p => p.name.toLowerCase().includes(ritual.key.split('-')[0]));
            if (matchingProduct) {
              ritual.featuredKitId = matchingProduct._id;
              await ritual.save();
            }
          }
          console.log("Rituals seeded and linked successfully.");
        }
      }
    } catch (err) {
      console.log("Database pre-seeding note: Server is starting. Seeding will run on API triggers.", err.message);
    }
  })
  .catch(err => {
    console.error('MongoDB connection failure. Running in database-fallback mode.', err.message);
  });

// Start listening
app.listen(PORT, () => {
  console.log(`Pooja Essentials Server running on http://localhost:${PORT}`);
});
