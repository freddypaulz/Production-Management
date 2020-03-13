import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import AddProduction from './Add_Production';
import EditProduction from './Edit_Production';

export default class ManageProduction extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'Batch ID', field: 'Batch_Id' },
            { title: 'Product Name', field: 'Product_Name' },
            { title: 'Quantity', field: 'Quantity' },
            {
               title: 'Measuring Unit',
               field: 'Measuring_Unit'
            },

            {
               title: 'Status',
               field: 'Status'
            }
         ],
         data: [],
         openAdd: false,
         openEdit: false,
         fieldDisabled: {
            Product_Name: false,
            Product_ID: false,
            Batch_Id: false,
            Quantity: false,
            Measuring_Unit: false,
            Expiry_Duration_Days: false,
            Manufacture_Date: false,
            btnDisplay: 'none',
            btnText: 'Close'
         }
      };
      this.OnEditHandler = (event, rowData) => {
         axios
            .post('/production', {
               _id: rowData._id
            })
            .then(res => {
               console.log(res.data[0]);
               this.EditData = { ...res.data[0] };
               console.log(this.EditData);
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios.get('/production').then(res => {
            console.log(res.data);
            for (let i = 0; i < res.data.length; i++) {
               res.data[i].id = i + 1;
               //Axios
               axios
                  .post('/measuring-units/measuring-unit', {
                     _id: res.data[i].Measuring_Unit
                  })
                  .then(MeasuringUnit => {
                     console.log(MeasuringUnit);
                     if (MeasuringUnit.data.MeasuringUnit[0]) {
                        console.log(
                           MeasuringUnit.data.MeasuringUnit[0]
                              .measuring_unit_name
                        );
                        res.data[i].Measuring_Unit =
                           MeasuringUnit.data.MeasuringUnit[0].measuring_unit_name;
                        this.setState({
                           data: [...res.data]
                        });
                     } else {
                        res.data[i].Measuring_Unit =
                           'problem loading Measuring Unit';
                        this.setState({
                           data: [...res.data]
                        });
                     }
                  });
               //end
               //Axios
               axios
                  .post('/products/product', {
                     _id: res.data[i].Product_Name
                     //_id: res.data[i].Product_ID
                  })
                  .then(ProductName => {
                     console.log(ProductName.data.Product[0].product_name);
                     if (ProductName.data.Product) {
                        console.log(ProductName.data.Product[0].product_name);
                        res.data[i].Product_Name =
                           ProductName.data.Product[0].product_name;
                        this.setState({
                           data: [...res.data]
                        });
                     } else {
                        res.data[i].Product_Name = 'problem loading';
                        this.setState({
                           data: [...res.data]
                        });
                     }
                  });
               //end
            }
            // this.setState({
            //   data: [...res.data.Productions]
            // });
         });
      };
   }
   componentDidMount() {
      this.handleClose();
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
               Manage Production
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
                     color: '#FFF',
                     fontSize: 'medium',
                     fontWeight: 'bold'
                  }
               }}
               actions={[
                  {
                     icon: 'edit',
                     tooltip: 'Edit User',

                     onClick: (event, rowData) => {
                        this.setState({
                           fieldDisabled: {
                              Product_Name: false,
                              Product_ID: false,
                              Batch_Id: false,
                              Quantity: false,
                              Measuring_Unit: false,
                              Expiry_Duration_Days: false,
                              Manufacture_Date: false,
                              btnDisplay: 'flex',
                              btnText: 'Cancel'
                           }
                        });
                        this.OnEditHandler(event, rowData);
                     }
                  }
               ]}
               editable={{
                  onRowDelete: oldData =>
                     axios
                        .post('/production/delete', {
                           _id: oldData._id
                        })
                        .then(Production => {
                           console.log(Production);
                           if (Production) {
                              this.setState(prevState => {
                                 const data = [...prevState.data];
                                 data.splice(data.indexOf(oldData), 1);
                                 return { ...prevState, data };
                              });
                           }
                        })
               }}
               onRowClick={(event, rowData) => {
                  this.setState({
                     fieldDisabled: {
                        Product_Name: true,
                        Product_ID: true,
                        Batch_Id: true,
                        Quantity: true,
                        Measuring_Unit: true,
                        Expiry_Duration_Days: true,
                        Manufacture_Date: true,
                        btnDisplay: 'none',
                        btnText: 'Close'
                     }
                  });
                  this.OnEditHandler(event, rowData);
               }}
            />
            <Dialog open={this.state.openAdd} maxWidth='md' fullWidth>
               <DialogContent>
                  <AddProduction
                     cancel={() => {
                        this.setState({
                           openAdd: false
                        });
                        this.handleClose();
                     }}
                  />
               </DialogContent>
            </Dialog>
            <Dialog open={this.state.openEdit} maxWidth='md' fullWidth>
               <DialogContent>
                  <EditProduction
                     disabled={this.state.fieldDisabled}
                     Production={this.EditData}
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
