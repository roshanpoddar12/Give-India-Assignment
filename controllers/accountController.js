const User = require('../models/userModel');
const Account = require('../models/accountModel');


exports.getAllAccounts = ( async (req, res) => {
  const accounts = await Account.find();
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: accounts.length,
    data: {
      accounts
    }
  });
});

exports.getAccount = async (req, res) => {
    const account = await Account.findById(req.body.id);
    if(account.length!=0){
        res.status(200).json({
            status: 'success',
            results: account.length,
            data: {
              account
            }
        });
    }
  res.status(500).json({
    status: 'error',
    message: 'Account with the Id is not found'
  });
};
exports.createAccountForUser = async(req, res) => {
  try{
    const accountDetails = req.body;
    if( accountDetails.accountType === 'BASIC_SAVING' && accountDetails.balanceAmount > 50000){
      res.status(500).json({
        status: 'error',
        message: 'BASIC_SAVINGS_ACCOUNT_EXCEEDED'
      })
    }
    const user = await User.findById({_id: req.params.id});
    if(user){
      const account = await Account.create ({
        user: user,
        accountType: req.body.accountType,
        balanceAmount: req.body.balanceAmount
    });
      user.accounts.push(account);
      user.save(); 
      res.status(200).json({
        status: 'success',
        message: 'Account created and Added to the particu;ar user'
      });
    }else{
      res.status(400).json({
        status: 'error',
        message: 'User Not Found!'
      });
    }
   

  }catch(err){
    res.status(400).json({
      status: 'error',
      message: err
    });
  }
};

exports.deleteAccount = (req, res) => {
    Account.findOneAndRemove({_id: req.params.id})
    .then((account) => {
       if(!account) {           
          res.status(404).send();        
       }          
       res.send(account);
  }).catch((e) => {          
       res.status(400).send(e);       
    });
  
};
