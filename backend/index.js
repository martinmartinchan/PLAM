const express = require('express');
const mongoose = require('mongoose');
const cookies = require('cookie-parser');
const dotenv = require('dotenv');

// Initiate app
const app = express();

// Setup environment
dotenv.config();

// Connect to database with mongoose
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Connected to the db'));


// Middleware
app.use(express.json());
app.use(cookies());

/** ------------- Routes ------------- */
// Routes connected to authentication
const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

// Routes connected to users
const userRoute = require('./routes/users');
app.use('/api/users', userRoute);

// Routes connected to plants
const plantRoute = require('./routes/plant');
app.use('/api/plant', plantRoute);

// Routes connected to posts
const postRoute = require('./routes/post')
app.use('/api/post', postRoute);

app.listen(3000, () => console.log('Server running on port 3000'));