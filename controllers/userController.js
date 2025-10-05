const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendOTP = require('../utils/sendOtp');
const jwt = require('jsonwebtoken');

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone, age, gender } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    age,
    gender,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Login user and send OTP (temporary token)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.isVerified = false;
    await user.save();

    // Send OTP email
    await sendOTP(user.email, otp);

    // Generate temporary token valid for 5 minutes
    const tempToken = generateToken(user._id, '5m');

    res.status(200).json({
      message: 'OTP sent to your email',
      tempToken,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Verify OTP using tempToken
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { otp } = req.body;

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp === otp) {
      user.isVerified = true;
      user.otp = null; // Clear OTP
      await user.save();

      // Generate full JWT for authenticated sessions
      const authToken = generateToken(user._id);
      res.json({ token: authToken, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Token expired or invalid' });
  }
};

// Update user's personalized health data
const updateHealthData = async (req, res) => {
  const {
    height,
    weight,
    activityLevel,
    fitnessGoal,
    dietaryPreferences,
    medicalConditions,
    targetWeight,
  } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.height = height || user.height;
    user.weight = weight || user.weight;
    user.activityLevel = activityLevel || user.activityLevel;
    user.fitnessGoal = fitnessGoal || user.fitnessGoal;
    user.dietaryPreferences = dietaryPreferences || user.dietaryPreferences;
    user.medicalConditions = medicalConditions || user.medicalConditions;
    user.targetWeight = targetWeight || user.targetWeight;

    const updatedUser = await user.save();
    res.json({ message: 'Health data updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get user's personalized health data
const getHealthData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      'height weight activityLevel fitnessGoal dietaryPreferences medicalConditions targetWeight'
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  updateHealthData,
  getHealthData,
};

