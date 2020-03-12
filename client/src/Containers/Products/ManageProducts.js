import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import permissionCheck from '../../Components/Auth/permissionCheck';

export default class ManageProducts extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'ID', field: 'id' },
            { title: 'Product Name', field: 'product_name' },
            { title: 'Product code', field: 'product_code' },
            { title: 'Product price', field: 'product_price' },
            { title: 'Measuring Unit', field: 'product_measuring_unit' },
            // { title: 'Registration Date', field: 'product_registration_date' },
            { title: 'Description', field: 'description' }
         ],
         data: [],
         openAdd: false,
         openEdit: false
      };
      this.OnEditHandler = (event, rowData) => {
         console.log(rowData._id);
         axios
            .post('/products/product', {
               _id: rowData._id
            })
            .then(res => {
               console.log(res);
               this.EditData = { ...res.data.Product };
               console.log(this.EditData[0]);
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios
            .get('/products/products')
            .then(res => {
               //console.log(res.data.States[0].country_id);
               for (let i = 0; i < res.data.Products.length; i++) {
                  res.data.Products[i].id = i + 1;
                  axios
                     .post('/measuring-units/measuring-unit', {
                        _id: res.data.Products[i].product_measuring_unit
                     })
                     .then(MeasuringUnit => {
                        console.log(MeasuringUnit);
                        if (MeasuringUnit.data.MeasuringUnit[0]) {
                           console.log(
                              MeasuringUnit.data.MeasuringUnit[0]
                                 .measuring_unit_name
                           );
                           res.data.Products[i].product_measuring_unit =
                              MeasuringUnit.data.MeasuringUnit[0].measuring_unit_name;
                           this.setState({
                              data: [...res.data.Products]
                           });
                        } else {
                           res.data.Products[i].product_measuring_unit =
                              'problem loading Measuring Unit';
                           this.setState({
                              data: [...res.data.Products]
                           });
                        }
                     });
               }
            })
            .catch(err => {
               console.log('Error');
            });
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Products')) {
         this.handleClose();
      }
   }
   render() {
      return (
         <Box
            width='100%'
            display='flex'
            alignItems='center'
            flexDirection='column'
         >
            <Box fontSize='30px' mb={3}>
               Manage Products
            </Box>
            <Box width='90%' display='flex' flexDirection='row'>
               <Button
                  variant='contained'
                  color='primary'
                  style={{
                     marginBottom: '20px',
                     display: 'flex',
                     marginRight: '10px'
                  }}
                  size='large'
                  onClick={() => {
                     this.setState({
                        openAdd: true
                     });
                  }}
               >
                  Add
               </Button>
            </Box>

            <MaterialTable
               title=' '
               columns={this.state.columns}
               data={this.state.data}
               style={{ width: '90%', maxHeight: '500px', overflow: 'auto' }}
               options={{
                  sorting: true,
                  headerStyle: {
                     backgroundColor: '#3f51b5',
                     color: '#FFF'
                  }
               }}
               actions={[
                  {
                     icon: 'edit',
                     tooltip: 'Edit',
                     onClick: (event, rowData) => {
                        this.OnEditHandler(event, rowData);
                     }
                  }
               ]}
               editable={{
                  onRowDelete: oldData =>
                     axios
                        .post('/products/delete-product', {
                           _id: oldData._id
                        })
                        .then(res => {
                           console.log(res);
                           if (res) {
                              this.setState(prevState => {
                                 const data = [...prevState.data];
                                 data.splice(data.indexOf(oldData), 1);
                                 return { ...prevState, data };
                              });
                           }
                        })
               }}
               onRowClick={(event, rowData) => {
                  this.OnEditHandler(event, rowData);
               }}
            />

            <Dialog open={this.state.openAdd} maxWidth='lg' fullWidth>
               <DialogContent style={{ padding: '20px' }}>
                  <AddProduct
                     cancel={() => {
                        this.setState({
                           openAdd: false
                        });
                        this.handleClose();
                     }}
                  />
               </DialogContent>
            </Dialog>
            <Dialog open={this.state.openEdit} maxWidth='lg' fullWidth>
               <DialogContent style={{ padding: '20px' }}>
                  <EditProduct
                     Product={this.EditData[0]}
                     cancel={() => {
                        this.setState({
                           openEdit: false
                        });
                        this.handleClose();
                     }}
                  />
               </DialogContent>
            </Dialog>
         </Box>
      );
   }
}
