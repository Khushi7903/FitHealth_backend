const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);

app.get('/', (req, res) => {
  res.send('FitHealth API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
