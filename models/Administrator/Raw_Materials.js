const mongoose = require('mongoose');

const RawMaterialSchema = mongoose.Schema({
   raw_material_name: {
      type: String,
      required: true,
      maxlength: [20, 'cannot exceed 20 characters']
   },
   raw_material_code: {
      type: String,
      required: true
   },
   raw_material_type: {
      type: String,
      required: true
   },
   raw_material_measuring_unit: {
      type: String,
      required: true
   },
   description: {
      type: String,
      maxlength: [200, 'cannot exceed 200 characters']
   },
   date: {
      type: Date,
      default: Date.now
   }
});

const RawMaterials = mongoose.model('RawMaterials', RawMaterialSchema);

module.exports = RawMaterials;
