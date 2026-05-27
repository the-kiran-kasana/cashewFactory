const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const stockRoutes = require('./routes/stockRoutes');
const productionRoutes = require('./routes/productionRoutes');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use('/api/stock', stockRoutes);
app.use('/api/production', productionRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});