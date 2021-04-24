const express = require('express');
const transactionController = require('../controllers/transactionController');

var router = express.Router();

router
  .route('/')
  .post(transactionController.performTransaction);

module.exports = router;