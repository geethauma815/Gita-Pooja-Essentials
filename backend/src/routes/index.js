const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const ritualController = require('../controllers/ritualController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const aiController = require('../controllers/aiController');
const pageController = require('../controllers/pageController');

const { authMiddleware, checkRole } = require('../middleware/auth');

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authMiddleware, authController.getProfile);
router.post('/auth/address', authMiddleware, authController.addAddress);

// --- Rituals Routes ---
router.get('/rituals', ritualController.getAllRituals);
router.get('/rituals/:key', ritualController.getRitualByKey);
router.post('/rituals', authMiddleware, checkRole(['admin']), ritualController.createRitual);

// --- Products Routes ---
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', authMiddleware, checkRole(['vendor', 'admin']), productController.createProduct);
router.put('/products/:id', authMiddleware, checkRole(['vendor', 'admin']), productController.updateProduct);

// --- Orders & Payments Routes ---
router.post('/orders/create', authMiddleware, orderController.createOrder);
router.post('/orders/verify', authMiddleware, orderController.verifyPayment);
router.get('/orders/customer', authMiddleware, orderController.getCustomerOrders);
router.get('/orders/analytics', authMiddleware, checkRole(['vendor', 'admin']), orderController.getAnalytics);

// --- AI Chatbot Route ---
router.post('/ai/chat', aiController.chatQuery);

// --- Dynamic Pages Routes ---
router.get('/pages', pageController.getAllPages);
router.get('/pages/:slug', pageController.getPageBySlug);
router.post('/pages', authMiddleware, checkRole(['admin']), pageController.createPage);
router.delete('/pages/:slug', authMiddleware, checkRole(['admin']), pageController.deletePage);

module.exports = router;
