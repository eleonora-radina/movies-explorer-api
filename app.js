require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimit');

const router = require('./routes/index');

const { NODE_ENV, MONGO, PORT = 3000 } = process.env;

const app = express();
mongoose.connect(NODE_ENV === 'production' ? MONGO : 'mongodb://127.0.0.1:27017/moviesdb');

/* app.use(cors({
  origin: ['http://localhost:3000', 'http://noradina.nomoredomains.icu', 'https://noradina.nomoredomains.icu'],
  credentials: true,
}));
*/

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);
app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});
