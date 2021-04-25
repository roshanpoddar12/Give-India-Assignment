const User = require('../models/userModel');
const Account = require('../models/accountModel');
const _ = require('lodash')

const TransactionErrors = {
    SAME_ACCOUNT  :"same_account",
    UNAUTHORIZED_TRANSACTION : "unauthorized_transaction",
    INSUFFICIENT_BALANCE : "insufficient_balance",
    BASIC_SAVINGS_LIMIT_REACHED : "basic_savings_limit_reached"
}
exports.performTransaction =  async (req, res) => {
    const transactionDetails =  req.body;
    try{
        const fromAccount = await Account.findById(transactionDetails.fromAccountId);
        const toAccount = await Account.findById(transactionDetails.toAccountId);
        const amount = transactionDetails.amount;

        if(String(fromAccount.user) === String(toAccount.user)){
            throw new Error(TransactionErrors.SAME_ACCOUNT);
        }
        if(fromAccount.balanceAmount < amount){
            throw new Error(TransactionErrors.INSUFFICIENT_BALANCE);
        }
        fromAccount.balanceAmount -= amount;
        toAccount.balanceAmount += amount;
        if (toAccount.accountType == 'BASIC_SAVINGS' && 
            toAccount.balanceAmount>50000) {
            throw new Error(TransactionErrors.BASIC_SAVINGS_LIMIT_REACHED);
        }
        await fromAccount.save();
        await toAccount.save();
        const transactionSuccess = {
            newSrcBalance: fromAccount.balanceAmount,
            totalDestBalance: toAccount.balanceAmount,
            transferedAt: Date.now()
        }
        res.status(200).json({
            status: 'success',
            results: transactionSuccess,
          });

    }catch(error){
        const failureResponse = errorResponseByError(error);
        res.status(failureResponse.errorCode).json({
            failureResponse
          });

    }
  };
  function errorResponseByError(error)
  {
      switch (error.message) {
          case TransactionErrors.SAME_ACCOUNT:
              return {
                  errorMessage: "transfer between accounts belonging to the same user is not allowed.",
                  errorCode: 500
              };
          case TransactionErrors.UNAUTHORIZED_TRANSACTION:
              return {
                  errorMessage: "unauthorized transaction.",
                  errorCode: 401
              };
          case TransactionErrors.INSUFFICIENT_BALANCE:
              return {
                  errorMessage: "insufficient balance.",
                  errorCode: 500
              };
          case TransactionErrors.BASIC_SAVINGS_LIMIT_REACHED:
              return {
                  errorMessage: sprintf(AccountController.BASIC_SAVINGS_BALANCE_AMOUNT_EXCEEDED, {
                          balanceAmount: AccountController.BASIC_SAVINGS_MAX_BALANCE_AMOUNT
                      }),
                  errorCode: 500
              };
          default:
              return {
                  errorMessage: "internal server error.",
                  errorCode: 500
              };
      }
  }