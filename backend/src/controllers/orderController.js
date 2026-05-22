const { Order, Product } = require('../models');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay SDK
// If keys are dummy, it operates in simulated mode
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy123456';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'dummypaymentsecret789';

let razorpayInstance = null;
try {
  if (razorpayKeyId && !razorpayKeyId.includes('dummy')) {
    razorpayInstance = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret
    });
  }
} catch (e) {
  console.log("Razorpay failed to initialize, using mock mode.", e.message);
}

// Create order on Razorpay & DB
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Verify prices & calculate total in backend
    let calculatedTotal = 0;
    const dbItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      calculatedTotal += dbProduct.price * item.quantity;
      dbItems.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        quantity: item.quantity,
        price: dbProduct.price
      });
    }

    // Generate a unique invoice number
    const invoiceNum = 'INV-' + Date.now().toString().slice(-8);

    // Create MongoDB Order entry first
    const orderObj = new Order({
      customerId: req.user.id,
      items: dbItems,
      totalAmount: calculatedTotal,
      shippingAddress: shippingAddress || { street: 'Main St', city: 'Hyderabad', state: 'Telangana', zipCode: '500001' },
      paymentStatus: 'pending',
      orderStatus: 'placed',
      invoiceNumber: invoiceNum
    });

    if (razorpayInstance) {
      // Create actual Razorpay Order
      const options = {
        amount: calculatedTotal * 100, // amount in paisa
        currency: "INR",
        receipt: invoiceNum
      };
      
      const razorpayOrder = await razorpayInstance.orders.create(options);
      orderObj.razorpayOrderId = razorpayOrder.id;
      await orderObj.save();

      return res.status(201).json({
        success: true,
        orderId: orderObj._id,
        razorpayOrderId: razorpayOrder.id,
        amount: calculatedTotal,
        keyId: razorpayKeyId,
        isMock: false
      });
    } else {
      // Mock payment mode
      const mockRazorpayId = 'order_mock_' + Math.random().toString(36).substring(2, 15);
      orderObj.razorpayOrderId = mockRazorpayId;
      await orderObj.save();

      return res.status(201).json({
        success: true,
        orderId: orderObj._id,
        razorpayOrderId: mockRazorpayId,
        amount: calculatedTotal,
        keyId: 'rzp_test_dummy123456',
        isMock: true
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error initiating order payment' });
  }
};

// Verify Razorpay payment signature
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, isMock } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (isMock || !razorpayInstance) {
      // Simulated successful payment for local testing
      order.paymentStatus = 'paid';
      order.razorpayPaymentId = razorpayPaymentId || 'pay_mock_' + Math.random().toString(36).substring(2, 10);
      await order.save();

      // Deduct inventory
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { inventory: -item.quantity }
        });
      }

      return res.json({ success: true, message: 'Mock payment verified successfully', order });
    }

    // Verify signature with real keys
    const text = razorpayOrderId + "|" + razorpayPaymentId;
    const generated_signature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(text)
      .digest("hex");

    if (generated_signature === razorpaySignature) {
      order.paymentStatus = 'paid';
      order.razorpayPaymentId = razorpayPaymentId;
      await order.save();

      // Deduct inventory
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { inventory: -item.quantity }
        });
      }

      res.json({ success: true, message: 'Payment verified successfully', order });
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

// Get orders of the logged-in customer
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving customer orders' });
  }
};

// Get Dashboard Analytics (Admin & Vendors)
exports.getAnalytics = async (req, res) => {
  try {
    const totalSalesAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);

    const sales = totalSalesAgg[0] ? totalSalesAgg[0].total : 0;
    const count = totalSalesAgg[0] ? totalSalesAgg[0].count : 0;

    // Monthly aggregation
    const monthlySales = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const salesChart = monthlySales.map(item => ({
      name: monthNames[item._id - 1] || `Month ${item._id}`,
      sales: item.sales,
      orders: item.orders
    }));

    // Category distribution mock analytics
    const categoryChart = [
      { name: 'Combo Kits', value: Math.round(sales * 0.65) },
      { name: 'Pooja Items', value: Math.round(sales * 0.20) },
      { name: 'Home Decor', value: Math.round(sales * 0.10) },
      { name: 'Prasad & Utensils', value: Math.round(sales * 0.05) }
    ];

    res.json({
      summary: {
        totalRevenue: sales,
        totalOrders: count,
        vendorCount: 14, // seed placeholder
        activeProducts: await Product.countDocuments()
      },
      salesTrend: salesChart.length > 0 ? salesChart : [
        { name: 'Mar', sales: Math.round(sales * 0.2), orders: 5 },
        { name: 'Apr', sales: Math.round(sales * 0.3), orders: 12 },
        { name: 'May', sales: Math.round(sales * 0.5), orders: 20 }
      ],
      categoryDistribution: categoryChart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving analytics statistics' });
  }
};
