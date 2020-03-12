import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import AddVendor from './AddVendor';
import EditVendor from './EditVendor';
import permissionCheck from '../../Components/Auth/permissionCheck';

export default class ManageVendors extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'ID', field: 'id' },
            { title: 'Vendor Name', field: 'vendor_name' },
            { title: 'Vendor Location', field: 'vendor_location' },
            // { title: 'Vendor Tax No', field: 'vendor_tax_no' },
            // { title: 'Vendor Mobile No', field: 'vendor_mobile_no' },
            { title: 'Description', field: 'description' }
         ],
         data: [],
         openAdd: false,
         openEdit: false
      };
      this.OnEditHandler = (event, rowData) => {
         console.log(rowData._id);
         axios
            .post('/vendors/vendor', {
               _id: rowData._id
            })
            .then(res => {
               console.log(res);
               this.EditData = { ...res.data.Vendor };
               console.log(this.EditData[0]);
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios
            .get('/vendors/vendors')
            .then(res => {
               //console.log(res.data.States[0].country_id);
               for (let i = 0; i < res.data.Vendors.length; i++) {
                  res.data.Vendors[i].id = i + 1;
                  //   axios
                  //      .post('/material-types/material-type', {
                  //         _id: res.data.Vendors[i].vendor_type
                  //      })
                  //      .then(MaterialType => {
                  //         console.log(MaterialType);
                  //         if (MaterialType.data.MaterialType[0]) {
                  //            console.log(
                  //               MaterialType.data.MaterialType[0]
                  //                  .material_type_name
                  //            );
                  //            res.data.Vendors[i].vendor_type =
                  //               MaterialType.data.MaterialType[0].material_type_name;
                  //            this.setState({
                  //               data: [...res.data.Vendors]
                  //            });
                  //         } else {
                  //            res.data.Vendors[i].material_type =
                  //               'problem loading Material Type';
                  //            this.setState({
                  //               data: [...res.data.Vendors]
                  //            });
                  //         }
                  //      });
               }
               this.setState({
                  data: [...res.data.Vendors]
               });
            })
            .catch(err => {
               console.log('Error');
            });
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Vendors')) {
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
               Manage Vendors
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
                        .post('/vendors/delete-vendor', {
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
                  <AddVendor
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
                  <EditVendor
                     Vendor={this.EditData[0]}
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
