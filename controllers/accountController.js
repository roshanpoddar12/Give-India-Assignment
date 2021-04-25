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

exports.deleteAccount = async(req, res) => {
  try{
    Account.findOneAndRemove({_id: req.params.id})
    .then(async(account) => {
      if(account){
        const user = await User.findById(account.user);
        for( var i = 0; i < user.accounts.length; i++){ 
          if (String(user.accounts[i])  === String(account._id)) { 
            user.accounts.splice(i, 1); 
              i--; 
          }
        } 
        user.save();
        res.send(account);
      }else if(!account) {           
        res.status(404).json({
          status:'error',
          message:"Account doesnot exist" 
        });        
     }
  }).catch((e) => {          
       res.status(400).json({
            status:'error',
            message:"Account doesnot exist" 
          });         
    });
  }catch(err){
    res.status(500).json({
      status:'error',
      message:err 
    });
  }
  
};
