const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/generatePlans", (req, res) => {
  const {
    height,
    weight,
    age,
    gender,
    activityLevel,
    fitnessGoal,
    dietaryPreferences,
    medicalConditions,
    targetWeight,
  } = req.body;

  const bmi = weight && height ? (weight / Math.pow(height / 100, 2)).toFixed(1) : null;

  let dietPlan = [];
  let workoutPlan = [];

  if (fitnessGoal === "Lose weight") {
    dietPlan = [
      "Breakfast: Oatmeal with fruits",
      "Lunch: Grilled tofu or chicken salad",
      "Dinner: Steamed veggies with brown rice",
      "Snack: Green tea with almonds",
    ];
  } else if (fitnessGoal === "Gain muscle") {
    dietPlan = [
      "Breakfast: Scrambled eggs with toast",
      "Lunch: Chicken breast with quinoa",
      "Dinner: Salmon with sweet potatoes",
      "Snack: Protein shake",
    ];
  } else {
    dietPlan = [
      "Breakfast: Greek yogurt with granola",
      "Lunch: Lentil soup and rice",
      "Dinner: Mixed veggie stir-fry",
      "Snack: Fruits or nuts",
    ];
  }

  if (dietaryPreferences && dietaryPreferences.toLowerCase().includes("vegan")) {
    dietPlan = dietPlan.map((meal) =>
      meal.replace(/chicken|eggs|fish|tofu|yogurt|salmon/gi, "plant protein")
    );
  }

  switch (activityLevel) {
    case "Sedentary":
      workoutPlan = ["20-min brisk walk", "10-min stretching"];
      break;
    case "Light":
      workoutPlan = ["30-min jog", "20-min bodyweight workout"];
      break;
    case "Moderate":
      workoutPlan = ["45-min strength training", "20-min cardio"];
      break;
    case "Active":
      workoutPlan = ["60-min HIIT + cardio mix", "45-min strength session"];
      break;
    default:
      workoutPlan = ["30-min walk", "Light stretching"];
  }

  res.json({
    success: true,
    bmi,
    dietPlan,
    workoutPlan,
    recommendation: bmi
      ? bmi < 18.5
        ? "You may want to gain some healthy weight."
        : bmi > 25
        ? "Focus on balanced meals and regular workouts."
        : "You're maintaining a healthy range."
      : "BMI not available.",
  });
});

app.listen(5001, () => console.log("✅ Mock ML service running on port 5001"));
