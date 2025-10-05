const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    otp: { type: String }, 
    isVerified: { type: Boolean, default: false },

    // Personalized Health Inputs
    height: { type: Number },            // in cm
    weight: { type: Number },            // in kg
    activityLevel: {                     
      type: String,
      enum: ['Sedentary', 'Light', 'Moderate', 'Active'],
    },
    fitnessGoal: {                      
      type: String,
      enum: ['Lose weight', 'Gain muscle', 'Maintain weight'],
    },
    dietaryPreferences: { type: String }, // e.g., Vegan, Vegetarian, Keto
    medicalConditions: { type: String }, 
    targetWeight: { type: Number },      

  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
