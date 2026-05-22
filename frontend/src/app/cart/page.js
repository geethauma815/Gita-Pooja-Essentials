'use client';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Link from 'next/link';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function CartPage() {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    getCartTotal, 
    clearCart,
    user,
    token,
    addAddress,
    addAlert,
    API_BASE
  } = useApp();

  // Address form
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || '');
  const [state, setState] = useState(user?.addresses?.[0]?.state || '');
  const [zipCode, setZipCode] = useState(user?.addresses?.[0]?.zipCode || '');

  // Payment simulator state
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrderDetails, setPendingOrderDetails] = useState(null);
  
  // Post-purchase confirmation state
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 80;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + gst;

  const handleSaveAddress = () => {
    if (!street || !city || !state || !zipCode) {
      addAlert('Please fill out all address fields', 'error');
      return;
    }
    addAddress({ street, city, state, zipCode, isDefault: true });
  };

  const handleCheckoutClick = async () => {
    if (!token) {
      addAlert('Please sign in / register using the header Login button to proceed to checkout.', 'info');
      return;
    }
    if (cart.length === 0) {
      addAlert('Your cart is empty.', 'error');
      return;
    }
    if (!street || !city || !zipCode) {
      addAlert('Please enter your shipping address details first.', 'error');
      return;
    }

    setCheckoutLoading(true);

    try {
      const res = await fetch(`${API_BASE}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          shippingAddress: { street, city, state, zipCode }
        })
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.message || 'Order creation failed');
      }

      setPendingOrderDetails(orderData);

      // Check if it's a mock payment (e.g. server is running mock mode, or script failed to load)
      if (orderData.isMock || typeof window.Razorpay === 'undefined') {
        // Trigger simulated popup modal
        setShowPaymentModal(true);
      } else {
        // Execute real Razorpay flow
        const options = {
          key: orderData.keyId,
          amount: orderData.amount * 100,
          currency: "INR",
          name: "Gita Divine Essentials",
          description: "Sacred Pooja & Festival Kits",
          order_id: orderData.razorpayOrderId,
          handler: async function (response) {
            await verifyPayment({
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              isMock: false
            });
          },
          prefill: {
            name: user?.name,
            email: user?.email
          },
          theme: {
            color: "#800020"
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.log("Server checkout error, falling back to instant client simulator:", err.message);
      // Fallback checkout simulation if backend server is offline entirely
      const offlineOrderId = 'order_offline_' + Date.now();
      setPendingOrderDetails({
        orderId: offlineOrderId,
        razorpayOrderId: 'order_rzp_offline',
        amount: total,
        isMock: true
      });
      setShowPaymentModal(true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const verifyPayment = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/orders/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setConfirmedOrder(data.order);
        clearCart();
        addAlert('Payment successful! Your order has been placed.', 'success');
      } else {
        addAlert('Payment verification failed.', 'error');
      }
    } catch (e) {
      // Offline fallback processing
      const simulatedOrder = {
        _id: payload.orderId,
        invoiceNumber: 'INV-' + Date.now().toString().slice(-8),
        totalAmount: total,
        createdAt: new Date().toISOString(),
        paymentStatus: 'paid',
        orderStatus: 'placed',
        items: cart,
        shippingAddress: { street, city, state, zipCode }
      };
      setConfirmedOrder(simulatedOrder);
      clearCart();
      addAlert('Simulated order generated successfully!', 'success');
    }
  };

  const simulatePaymentResponse = async (success) => {
    setShowPaymentModal(false);
    if (!success) {
      addAlert('Payment failed or cancelled by user.', 'error');
      return;
    }

    if (pendingOrderDetails) {
      await verifyPayment({
        orderId: pendingOrderDetails.orderId,
        razorpayOrderId: pendingOrderDetails.razorpayOrderId,
        razorpayPaymentId: 'pay_mock_' + Math.random().toString(36).substring(2, 10),
        isMock: true
      });
    }
  };

  // If purchase is completed, show success screen
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="h-16 w-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto divine-glow shadow-md">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-spiritual-gradient">Order Placed Successfully!</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Thank you for choosing Gita Divine. Your puja essentials are being packed with spiritual care.
        </p>

        {/* Invoice Summary */}
        <div className="bg-white dark:bg-darkslate border border-gold/20 rounded-2xl p-6 text-left space-y-4 shadow-lg">
          <div className="flex justify-between items-center pb-2 border-b border-gold/15 text-xs text-slate-400">
            <span>Invoice: <strong>{confirmedOrder.invoiceNumber}</strong></span>
            <span>Date: {new Date(confirmedOrder.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="space-y-2">
            {confirmedOrder.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs font-bold">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gold/15 pt-3 flex justify-between items-center font-extrabold text-base text-crimson dark:text-gold">
            <span>Total Paid (incl. GST)</span>
            <span>₹{confirmedOrder.totalAmount}</span>
          </div>

          <div className="text-[11px] text-slate-500 bg-gold/5 p-3 rounded-lg border border-gold/10">
            <strong>Shipping Address:</strong> {confirmedOrder.shippingAddress?.street}, {confirmedOrder.shippingAddress?.city}, {confirmedOrder.shippingAddress?.state} - {confirmedOrder.shippingAddress?.zipCode}
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link href="/" className="bg-gradient-to-r from-crimson to-amber text-white font-bold px-6 py-3 rounded-xl hover:shadow duration-200">
            Go to Home
          </Link>
          <button 
            onClick={() => window.print()}
            className="border border-gold text-darkslate dark:text-cream px-6 py-3 rounded-xl hover:bg-gold/10 font-bold duration-200"
          >
            Print Invoice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="font-serif text-3xl font-bold text-spiritual-gradient">Shopping Cart & Checkout</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-darkslate border border-gold/20 rounded-3xl p-8 space-y-4">
          <ShoppingBag className="h-16 w-16 text-gold/40 mx-auto" />
          <h3 className="font-serif text-xl font-bold">Your Cart is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our festivals catalog or customize your own prayer checklist using the Kit Builder!
          </p>
          <Link href="/" className="inline-block bg-gradient-to-r from-crimson to-amber text-white font-bold px-6 py-2.5 rounded-lg duration-200">
            View Festivals
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List (7 Columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-darkslate border border-gold/20 rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="font-serif text-lg font-bold text-crimson dark:text-gold border-b border-gold/15 pb-2">
              Selected Essentials
            </h3>

            <div className="space-y-4 divide-y divide-gold/10">
              {cart.map((item) => (
                <div key={item.productId} className="flex gap-4 pt-4 first:pt-0 items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-cream">
                      {item.name}
                    </h4>
                    {item.customItems && (
                      <span className="text-[10px] bg-green-500/10 text-green-600 border border-green-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        Customized Kit ({item.customItems.length} items)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Quantity Counters */}
                    <div className="flex items-center border border-gold/30 rounded-lg overflow-hidden bg-cream/10">
                      <button
                        onClick={() => updateCartQuantity(item.productId, -1)}
                        className="p-1 px-2 hover:bg-gold/10 text-xs font-bold"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-bold px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, 1)}
                        className="p-1 px-2 hover:bg-gold/10 text-xs font-bold"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="text-sm font-extrabold text-crimson dark:text-gold w-16 text-right">
                      ₹{item.price * item.quantity}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg duration-200"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Billing Summary (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Delivery Address */}
            <div className="bg-white dark:bg-darkslate border border-gold/20 rounded-3xl p-6 shadow-md space-y-4">
              <h3 className="font-serif text-lg font-bold text-crimson dark:text-gold flex items-center gap-1">
                <MapPin className="h-5 w-5" /> Delivery Address
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="House No, Apartment, Street name"
                    className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Hyderabad"
                      className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Telangana"
                      className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Pincode (ZIP)</label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="e.g. 500001"
                    className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                  />
                </div>

                {token && (
                  <button
                    onClick={handleSaveAddress}
                    className="text-crimson dark:text-gold font-bold hover:underline"
                  >
                    Save Address to Profile
                  </button>
                )}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-white dark:bg-darkslate border border-gold/20 rounded-3xl p-6 shadow-md space-y-4">
              <h3 className="font-serif text-lg font-bold text-crimson dark:text-gold border-b border-gold/15 pb-2">
                Order Invoice Summary
              </h3>

              <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Traditional Bio-Packaging & Delivery</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pooja GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="border-t border-gold/10 pt-2 flex justify-between font-extrabold text-base text-crimson dark:text-gold">
                  <span>Total Payable Amount</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                disabled={checkoutLoading}
                className="w-full bg-gradient-to-r from-crimson to-amber hover:shadow-lg text-white font-bold py-3.5 rounded-xl divine-glow-amber flex items-center justify-center gap-2 duration-200 disabled:opacity-50"
              >
                <CreditCard className="h-5 w-5" /> 
                {checkoutLoading ? 'Processing Checkout...' : 'Secure Checkout & Pay'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Razorpay Gateway Simulator Modal Overlay */}
      {showPaymentModal && pendingOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-[#121528] text-white max-w-md w-full rounded-2xl border-2 border-blue-500 overflow-hidden shadow-2xl p-6 space-y-6">
            
            {/* Header branding Razorpay */}
            <div className="flex justify-between items-center pb-4 border-b border-blue-900">
              <div className="flex items-center gap-2">
                <span className="text-blue-500 font-extrabold text-lg tracking-tight font-sans italic">Razorpay</span>
                <span className="bg-blue-500/20 text-blue-400 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Test Mode</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Amount Due</span>
                <span className="text-lg font-extrabold text-emerald-400">₹{total}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-slate-200">Secure Payment Gateway Simulator</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You are evaluating the integration. Select an action below to simulate standard Razorpay merchant API callbacks.
                </p>
              </div>

              {/* Order Metadata */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1 font-mono text-[10px] text-slate-300">
                <div>Merchant: GITA STUDIOS PVT LTD</div>
                <div>OrderID: {pendingOrderDetails.razorpayOrderId}</div>
                <div>Receipt: {pendingOrderDetails.invoiceNumber || 'INV-TEMP'}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => simulatePaymentResponse(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg flex flex-col items-center justify-center gap-1 shadow-md transition"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-xs">Simulate Success</span>
                </button>
                
                <button
                  onClick={() => simulatePaymentResponse(false)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-lg flex flex-col items-center justify-center gap-1 shadow-md transition"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="text-xs">Simulate Decline</span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-xs text-slate-500 hover:underline"
              >
                Cancel and return to checkout
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
