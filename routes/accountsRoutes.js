const express = require('express');
const accountController = require('./../controllers/accountController');

var router = express.Router();

router
  .route('/')
  .get(accountController.getAllAccounts)

router
  .route('/:id')
  .get(accountController.getAccount)
  .post(accountController.createAccountForUser)
  .delete(accountController.deleteAccount);

module.exports = router;