const LocalStratagy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user Model
const Users = require('../models/User');

module.exports = passport => {
   passport.use(
      new LocalStratagy({ usernameField: 'name' }, (name, password, done) => {
         Users.findOne({ name })
            .then(User => {
               if (!User) {
                  return done(null, false, { msg: 'User not registered' });
               }

               //Match Password
               bcrypt.compare(password, User.password, (err, isMatch) => {
                  if (err) throw err;
                  if (isMatch) {
                     return done(null, User);
                  } else {
                     return done(null, false, { msg: 'invalid password' });
                  }
               });
            })
            .catch(err => console.log(err));
      })
   );

   passport.serializeUser((user, done) => {
      done(null, user.id);
   });

   passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
         done(err, user);
      });
   });
};
