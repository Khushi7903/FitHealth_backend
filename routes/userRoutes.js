const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOTP , updateHealthData, getHealthData,} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);

// Personalized input
router.put('/health', protect, updateHealthData);   // Update user health data
router.get('/health', protect, getHealthData);     // Get user health d

module.exports = router;
