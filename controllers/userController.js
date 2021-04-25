const User = require('../models/userModel');
const Account = require('../models/accountModel');

exports.getAllUsers = ( async (req, res) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});
exports.getUser = async (req, res) => {
    const users = await User.findById(req.body.id);
    if(users.length!=0){
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
              users
            }
        });
    }
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = async (req, res) => {
  try{
    await User.create({
      name: req.body.name,
      age: req.body.age
  });
  res.status(200).json({
    status: 'success',
    })
  }catch(err){
    res.status(400).json({
      status: 'error',
      message: err
    });
  }
};
exports.updateUser = (req, res) => {
    const id = req.params.id;
    let name = req.body.name;
    let age = req.body.age;
    User.findByIdAndUpdate(id, { name, age },function (err, docs) {
    if (err){
        res.status(500).json({
            status: 'error',
            message: err
          });
    }
    else{
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
              docs
            }
            })
    }
});
};
exports.deleteUser = async(req, res) => {
  try{
    const user = await User.findById(req.params.id)
  Account.deleteMany(
    {
      _id: {
        $in: user.accounts
      }
    },
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        User.findOneAndRemove({_id: req.params.id})
        .then((user) => {
          if(!user) {           
              res.status(404).send();        
          }          
          res.send(user);
        }).catch((e) => {          
          res.status(400).send(e);       
        });
      }
    }
  );
  }catch(err){
    res.status(500).json({
      status: 'error',
      message: err
    });
  }
  
    
  
};
