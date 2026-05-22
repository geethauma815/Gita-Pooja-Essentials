const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
      addresses: [],
      wishlist: [],
      savedRituals: []
    });

    await user.save();

    // Generate JWT
    const payload = { id: user._id, role: user.role, name: user.name };
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'supersecretpoojaandfestivalessentialskey123',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = { id: user._id, role: user.role, name: user.name };
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'supersecretpoojaandfestivalessentialskey123',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// Add or update shipping address
exports.addAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, isDefault } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (isDefault) {
      // Set all other addresses to false
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }

    user.addresses.push({ street, city, state, zipCode, isDefault });
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding address' });
  }
};
