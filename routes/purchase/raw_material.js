const express = require('express');
const router = express.Router();
const RawMaterials = require('../../models/Administrator/Raw_Materials');

router.get('/', (req, res, next) => {
   RawMaterials.find({}).then(RawMaterials => {
      res.send({ RawMaterials });
   });
});

router.post('/', (req, res) => {
   RawMaterials.find({ _id: req.body._id }).then(RawMaterial => {
      res.send({ RawMaterial });
   });
});

router.post('/raw-material-name', (req, res) => {
   RawMaterials.find({ raw_material_name: req.body.raw_material_name }).then(
      RawMaterial => {
         res.send({ RawMaterial: RawMaterial });
      }
   );
});

module.exports = router;
