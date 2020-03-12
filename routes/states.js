const express = require('express');
const router = express.Router();
const States = require('../models/State');

router.get('/states', (req, res, next) => {
   //console.log(sessionStorage.getItem('Authenticated'));
   States.find({}).then(states => {
      res.send({ States: states });
   });
});

router.post('/state', (req, res, next) => {
   States.find({ _id: req.body._id }).then(state => {
      res.send({ state });
   });
});
router.post('/state-country', (req, res, next) => {
   States.find({ country_id: req.body.country_id }).then(state => {
      res.send({ state });
   });
});

router.post('/state-name', (req, res, next) => {
   States.find({ state_name: req.body.state_name }).then(state => {
      res.send({ State: state });
   });
});

router.post('/add-state', (req, res) => {
   console.log('Hello');
   const { state_name, country_id, description } = req.body;
   let errors = [];

   if (!state_name || !country_id) {
      errors.push('Enter all required fields');
   }

   if (state_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for Name');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      States.findOne({ state_name }).then(State => {
         if (State) {
            errors.push('State name already taken');
            res.send({ errors });
         } else {
            const newState = new States({
               state_name,
               country_id,
               description
            });
            newState.save().then(State => {
               return res.send({ State, errors });
            });
         }
      });
   }
   console.log('Hello');
});

router.post('/edit-state', (req, res) => {
   const { _id, state_name, country_id, description } = req.body;
   let errors = [];

   if (!state_name || !country_id) {
      errors.push('Enter all required fields');
   }
   if (state_name.length > 20) {
      errors.push('Use 20 or less characters for state Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (state_name) {
      States.find({ state_name }).then(states => {
         if (typeof states[0] !== 'undefined') {
            if (states[0]._id != _id) {
               errors.push('State Name must be unique');
            }
         }
         if (errors.length > 0) {
            return res.send({ errors });
         } else {
            States.findOneAndUpdate(
               { _id },
               {
                  state_name,
                  country_id,
                  description
               }
            ).then(State => {
               if (!State) {
                  errors.push('state Not found');
                  return res.send({ errors });
               } else {
                  return res.send({ State, errors });
               }
            });
         }
      });
   }
});

router.post('/delete-state', (req, res) => {
   States.findOneAndDelete({ state_name: req.body.state_name }).then(State => {
      res.send(State);
   });
});

module.exports = router;
