const axios = require("axios");
const User = require("../models/User");

const generatePlans = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Send user’s health data to mock ML microservice
    const mlResponse = await axios.post("http://localhost:5001/api/generatePlans", {
      height: user.height,
      weight: user.weight,
      age: user.age,
      gender: user.gender,
      activityLevel: user.activityLevel,
      fitnessGoal: user.fitnessGoal,
      dietaryPreferences: user.dietaryPreferences,
      medicalConditions: user.medicalConditions,
      targetWeight: user.targetWeight,
    });

    const { dietPlan, workoutPlan } = mlResponse.data;

    // Save plans in user’s document
    user.dietPlan = dietPlan;
    user.workoutPlan = workoutPlan;
    await user.save();

    res.status(200).json({
      message: "Diet and workout plans generated successfully",
      dietPlan,
      workoutPlan,
    });
  } catch (error) {
    console.error("Error generating plans:", error.message);
    res.status(500).json({ message: "Failed to generate plans", error: error.message });
  }
};

module.exports = { generatePlans };
