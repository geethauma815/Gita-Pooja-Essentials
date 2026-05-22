const mongoose = require('mongoose');

// --- USER SCHEMA ---
const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
  addresses: [AddressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  savedRituals: [{ type: String }], // list of ritual keys
  createdAt: { type: Date, default: Date.now }
});

// --- PRODUCT SCHEMA (Pooja Items & Combo Kits) ---
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  images: [{ type: String }],
  category: { 
    type: String, 
    enum: ['pooja-item', 'kit-combo', 'decor', 'prasad', 'utensil'], 
    required: true 
  },
  inventory: { type: Number, default: 100 },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  region: { 
    type: String, 
    enum: ['all', 'telugu', 'tamil', 'hindi', 'kannada', 'malayalam'], 
    default: 'all' 
  },
  rating: { type: Number, default: 4.5 },
  createdAt: { type: Date, default: Date.now }
});

// --- FESTIVAL & RITUAL SCHEMA ---
const ChecklistItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  baseQuantity: { type: String, default: "1" },
  optional: { type: Boolean, default: false },
  estimatedPrice: { type: Number, default: 10 },
  category: { type: String, default: "essential" } // e.g. flowers, fruits, utensils
});

const RitualStepSchema = new mongoose.Schema({
  stepNumber: Number,
  title: String,
  instruction: String
});

const RitualSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true, index: true }, // e.g., 'satyanarayana-vratham'
  category: { 
    type: String, 
    enum: ['festival', 'vratham', 'ceremony', 'temple'], 
    required: true 
  },
  description: { type: String, required: true },
  significance: { type: String },
  upcomingDate: { type: String }, // e.g. "2026-06-15"
  timings: { type: String }, // auspicious muhurtham
  checklist: [ChecklistItemSchema],
  steps: [RitualStepSchema],
  baseBudget: { type: Number, default: 500 },
  featuredKitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});

// --- ORDER SCHEMA ---
const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  shippingAddress: AddressSchema,
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  orderStatus: { 
    type: String, 
    enum: ['placed', 'packed', 'shipped', 'delivered'], 
    default: 'placed' 
  },
  invoiceNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// --- DYNAMIC PAGES SCHEMA ---
const PageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Export all models
module.exports = {
  User: mongoose.model('User', UserSchema),
  Product: mongoose.model('Product', ProductSchema),
  Ritual: mongoose.model('Ritual', RitualSchema),
  Order: mongoose.model('Order', OrderSchema),
  Page: mongoose.model('Page', PageSchema)
};
