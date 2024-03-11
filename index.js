const express = require('express');
const bodyParser = require('body-parser');
const i18n = require('i18n');
var cors = require('cors');
const app = express();
const dotenv = require("dotenv").config();
app.use(bodyParser.json());
app.use(cors());

const path = require('path');

i18n.configure({
  locales: ['en', 'fa'], // List of supported languages
  defaultLocale: 'fa', // Default language
  cookie: 'locale',
  directory: path.join(__dirname, 'locales'), // Path to translation files
  objectNotation: true, // Use object notation for translation strings
  queryParameter: 'lang', // Query parameter to set the language (e.g., /route?lang=fr)
  autoReload: true, // Automatically reload translation files when they change
  updateFiles: false, // Don't automatically update translation files (set to true in development)
});

app.use(i18n.init);

// Import routes
// const validateUser = require('./validators/validateUser');
const authRoutes = require('./routes/authRoutes');
const productRouter = require('./routes/product');
const stockRouter = require('./routes/stock');
const stockItemRouter = require('./routes/stockItem');
const userRouter = require('./routes/user');
const dataRouter = require('./routes/data');
const driverRouter = require('./routes/driver');
const vehicleRouter = require('./routes/vehicle');
const locationRoute=require('./routes/locationRoute');
// Use routes

app.use('/auth', authRoutes);
app.use('/product', productRouter);
app.use('/stock', stockRouter);
app.use('/stock_item', stockItemRouter);
app.use('/user', userRouter);
app.use('/data', dataRouter);
app.use('/driver', driverRouter);
app.use('/vehicle', vehicleRouter);
app.use('/locations',locationRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});