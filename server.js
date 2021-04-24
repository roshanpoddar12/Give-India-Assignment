const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Account = require('./models/accountModel');


process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

const DB = process.env.DATABASE_LOCAL;

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(async () => {
    console.log("Connected to the DB")
    let totalUsers = await User.find()
    console.log(totalUsers)
     // Initializing users and accounts for test
     if (totalUsers.length === 0) {
      // insert new users for test
      const user1 = await User.create({
          name: "Jack",
          age: 27
      });
      const user2 = await User.create({
          name: "Jones",
          age: 24
      });
      const user3 = await User.create({
          name: "Harry",
          age: 24
      });
      const allUsers = [user1, user2, user3];
      const allAccountTypes = ['BASIC_SAVINGS', 'CURRENT', 'SAVINGS'];

      for (const user of allUsers) {
        
          for (let index = 0; index < 3; index++) {
              const randomAccountTypeIndex = Math.floor(Math.random() * 3);
              const randomAccountType = allAccountTypes[randomAccountTypeIndex];
              const balanceThreshold = randomAccountType === 'BASIC_SAVINGS' ? 50000 : 100000;
              const randomBalance = Math.floor(Math.random() * balanceThreshold);
              const account = await Account.create ({
                  user: user,
                  balanceAmount: randomBalance,
                  accountType: randomAccountType
              });
              console.log('account',account);
              console.log('user',user)
              const filUser = await User.findById({_id: user._id});
              filUser.accounts.push(account);
              console.log('filuser:',filUser);
              filUser.save();  
          }
          //await User.findByIdAndUpdate(user._id,filUser)
      }
    }
  });



process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
