const mongoose = require('mongoose');
const User = require('./userModel');

const accountSchema = new mongoose.Schema({
    accountType: {
        type: String,
        enum: ['SAVINGS', 'CURRENT', 'BASIC_SAVINGS'],
        default: 'SAVINGS'
      },
      user: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User',
        required: [true] 
        
      },
      balanceAmount:Number,
      createdOn:Date,
      UpdatedOn: Date
  
});


const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
