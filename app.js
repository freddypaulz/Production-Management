const express = require('express');

const mongoose = require('mongoose');

const passport = require('passport');

const fileupload = require('express-fileupload');
//Passport Config
require('./config/passport')(passport);

//DB Config
//const db = require('./config/keys').MONGO_URI;

//mongo
mongoose
   .connect(
      'mongodb+srv://freddypaulz:mongo123@cluster0-6kohd.mongodb.net/ProductionManagement?retryWrites=true&w=majority',
      {
         useNewUrlParser: true,
         useCreateIndex: true,
         useUnifiedTopology: true,
         useFindAndModify: false
      }
   )
   .then(() => {
      console.log('DB connected');
   })
   .catch(err => {
      console.log(err);
   });

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//aws
// const path = require('path');
// app.use(express.static(path.join(__dirname, 'client/build')));

//Admin
app.use('/', require('./routes/administrator/index'));
app.use('/users', require('./routes/administrator/users'));
app.use('/roles', require('./routes/administrator/roles'));
app.use('/shifts', require('./routes/administrator/shifts'));
app.use('/countries', require('./routes/administrator/countries'));
app.use('/states', require('./routes/administrator/states'));
app.use('/cities', require('./routes/administrator/cities'));
app.use('/measuring-units', require('./routes/administrator/measuringUnit'));
app.use('/material-types', require('./routes/administrator/materialTypes'));
app.use('/raw-materials', require('./routes/administrator/rawMaterials'));
app.use('/work-locations', require('./routes/administrator/workLocations'));
app.use('/production-units', require('./routes/administrator/productionUnits'));
app.use('/products', require('./routes/administrator/products'));
app.use('/departments', require('./routes/administrator/departments'));
app.use('/vendors', require('./routes/administrator/vendors'));
app.use('/distributors', require('./routes/administrator/distributors'));
app.use('/employees', require('./routes/administrator/employees'));
app.use('/boxes', require('./routes/administrator/boxes'));
app.use('/designations', require('./routes/administrator/designations'));
app.use(
   '/request-details',
   require('./routes/administrator/requests/requestDetails')
);
app.use('/logs', require('./routes/administrator/logs/logs'));
app.use(
   '/product-code',
   require('./routes/administrator/configurations/productCode')
);
app.use('/productions', require('./routes/administrator/reports/productions'));
app.use('/sales', require('./routes/administrator/reports/sales'));

//Purchase
app.use('/request-details', require('./routes/purchase/request_details'));
app.use('/raw-material', require('./routes/purchase/raw_material'));
app.use('/vendor', require('./routes/purchase/VendorsRoute'));
app.use('/log', require('./routes/purchase/LogsRoute'));
app.use('/measuring-unit', require('./routes/purchase/measuringUnit'));
app.use('/files', require('./routes/purchase/FilesRoute'));
app.use('/purchase-stocks', require('./routes/purchase/PurchaseStocksRoute'));
app.use(
   '/purchase-wastages',
   require('./routes/purchase/PurchaseWastagesRoute')
);
app.use(
   '/production',
   require('./Routes/purchase/production_raw_material_stock')
);

app.listen(5000, () => {
   console.log(`App listening on port ${PORT}!`);
});
