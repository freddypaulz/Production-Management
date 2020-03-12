const express = require('express');
const router = express.Router();
const Roles = require('../models/Role');

router.get('/roles', (req, res, next) => {
   Roles.find({}).then(roles => {
      res.send({ Roles: roles });
   });
});

router.post('/role', (req, res, next) => {
   Roles.find({ _id: req.body._id }).then(role => {
      res.send({ Role: role });
   });
});
router.post('/role-name', (req, res, next) => {
   Roles.find({ role_name: req.body.role_name }).then(role => {
      res.send({ Role: role });
   });
});

router.post('/add-role', (req, res) => {
   const { role_name, description, permissions } = req.body;
   let errors = [];

   if (!role_name || !permissions) {
      errors.push('Enter all required fields');
   }

   if (role_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (permissions) {
      let checkPermission = 0;
      permissions.map(permission => {
         if (permission.value) {
            checkPermission++;
         }
      });
      if (checkPermission === 0) {
         errors.push('Select atleast one Permission');
      }
   }
   if (description.length > 200) {
      errors.push('Use 20 or less characters for Name');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      Roles.findOne({ role_name }).then(Role => {
         if (Role) {
            errors.push('Role already available');
            res.send({ errors });
         } else {
            const newRole = new Roles({
               role_name,
               description,
               permissions
            });
            newRole.save().then(Role => {
               return res.send({ Role, errors });
            });
         }
      });
   }
});

router.post('/edit-role', (req, res) => {
   const { _id, role_name, description, permissions } = req.body;
   let errors = [];

   if (!role_name || !permissions) {
      errors.push('Enter all required fields');
   }
   if (role_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }
   if (permissions) {
      let checkPermission = 0;
      permissions.map(permission => {
         if (permission.value) {
            checkPermission++;
         }
      });
      if (checkPermission === 0) {
         errors.push('Select atleast one Permission');
      }
   }
   if (description.length > 200) {
      errors.push('Use 20 or less characters for Name');
   }
   if (role_name) {
      Roles.find({ role_name }).then(Role => {
         if (typeof Role[0] !== 'undefined') {
            if (Role[0]._id != _id) {
               errors.push('Role Name must be unique');
            }
         }
         if (errors.length > 0) {
            res.send({ errors });
         } else {
            Roles.findOneAndUpdate(
               { _id },
               {
                  role_name,
                  description,
                  permissions
               }
            ).then(Role => {
               if (!Role) {
                  errors.push('Role Not found');
                  res.send({ errors });
               } else {
                  res.send({ Role, errors });
               }
            });
         }
      });
   }
});
router.post('/delete-role', (req, res) => {
   Roles.findOneAndDelete({ role_name: req.body.role_name }).then(Role => {
      res.send(Role);
   });
   console.log('Hello');
});

module.exports = router;
