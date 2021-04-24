const express = require('express');
const morgan = require('morgan');

const accountRouter = require('./routes/accountsRoutes');
const userRouter = require('./routes/userRoutes');
const transactionRouter = require('./routes/transactionRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/account', accountRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/transaction', transactionRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


module.exports = app;
