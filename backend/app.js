const express = require('express');
const mongoose = require('mongoose');
const cookies = require('cookie-parser');
const dotenv = require('dotenv');
const config = require('config');
const cors = require('cors');

// Initiate app
const app = express();

// Setup environment
dotenv.config();

// Connect to database with mongoose
mongoose.connect(process.env[config.get('db_connect')], { useNewUrlParser: true, useUnifiedTopology: true }, () => {
	// Only log connected to db if in dev
	if (!process.env.NODE_ENV) {
		console.log('Connected to the db');
	}
});

// Middleware
app.use(express.json());
app.use(cookies());
app.use(cors({ origin: config.get('cors_origin'), credentials: true }));

/** ------------- Routes ------------- */
// Routes connected to authentication
const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

// Routes connected to users
const userRoute = require('./routes/users');
app.use('/api/users', userRoute);

// Routes connected to posts
const postRoute = require('./routes/plantpost')
app.use('/api/plantpost', postRoute);

module.exports = app;