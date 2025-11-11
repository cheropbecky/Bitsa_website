const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // ensure .env is loaded

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('Loaded MONGO_URI:', process.env.MONGO_URI ? '✅ found' : '❌ missing');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Connect to Atlas using environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
