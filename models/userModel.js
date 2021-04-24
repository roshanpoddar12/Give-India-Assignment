const mongoose = require('mongoose');
const Account = require('./accountModel');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  age:Number,
  createdOn: Date,
  updatedOn: Date,
  accounts:[{
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
    required: [true]
  }]
});
// userSchema.pre('save',async function(next){
//   console.log('middleware',this.accounts)
//   const accountPromise = this.accounts.map(async id => await Account.findById(id));
//   this.accounts = await Promise.all(accountPromise);
//   next();
// })

const User = mongoose.model('User', userSchema);

module.exports = User;
