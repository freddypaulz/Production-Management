import React, { Component } from 'react';
import MaterialTable from 'material-table';
import {
   Box,
   DialogContent,
   Snackbar,
   Button,
   LinearProgress,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import EditPurchase from './Finance_Edit_Purchase';
import Alert from '@material-ui/lab/Alert';

export default class Manage_Finance extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'Material Name', field: 'Raw_Material_Id' },
            { title: 'Quantity', field: 'Quantity' },
            { title: 'Measuring Unit', field: 'Measuring_Unit' },
            // { title: 'Priority', field: 'Priority' },
            { title: 'Status', field: 'Status' },
            { title: 'Comments', field: 'Comments' },
         ],
         data: [],
         msg: 'Fetching Data...',
         openAdd: false,
         openEdit: false,
         alert: false,
         materialList: [],
         unitList: [],
         vendorList: [],
         fieldDisabled: {
            quantity: false,
            unit: false,
            vendor: false,
            amount: false,
            status: false,
            comment: false,
            btnDisplay: 'none',
            btnText: 'Close',
            from: '',
            to: '',
            uploadFile: 'flex',
         },
         logComments: 'no commments',
         progress: 0,
         isLoading: true,
      };
      this.closeAlert = () => {
         this.setState({ alert: false });
      };
      this.loadDetails = () => {
         axios.get('/request-details').then((res) => {
            let temp = [];
            console.log('Details: ', res.data);
            for (let i = 0; i < res.data.length; i++) {
               res.data[i].Raw_Material_Id = this.getMaterialName(
                  res.data[i].Raw_Material_Id
               );
               res.data[i].Measuring_Unit = this.getUnit(
                  res.data[i].Measuring_Unit
               );
               res.data[i].Vendor = this.getVendor(res.data[i].Vendor);
               temp.push(res.data[i]);
            }
            this.setState({
               data: temp,
               msg: 'Data Not Found!',
            });
         });
      };
      this.OnEditHandler = (event, rowData) => {
         axios
            .post('/request-details', {
               _id: rowData._id,
            })
            .then((res) => {
               this.EditData = { ...res.data[0] };
               this.setState({
                  openEdit: true,
               });
            });
      };
      this.getMaterialName = (id) => {
         let temp = id;
         this.state.materialList.map((material) => {
            if (material._id === id) {
               temp = material.raw_material_name;
            }
            return null;
         });
         return temp;
      };
      this.getUnit = (id) => {
         let temp = id;
         this.state.unitList.map((unit) => {
            if (unit._id === id) {
               temp = unit.measuring_unit_name;
            }
            return null;
         });
         return temp;
      };
      this.getVendor = (id) => {
         let temp = id;
         if (id !== '') {
            this.state.vendorList.map((vendor) => {
               if (vendor._id === id) {
                  temp = vendor.vendor_name;
               }
               return null;
            });
         } else {
            temp = 'undefined';
         }
         return temp;
      };
      this.handleClose = () => {
         //get Material List
         axios
            .get('/raw-materials/raw-materials')
            .then((res) => {
               this.setState({
                  materialList: [...res.data.RawMaterials],
                  progress: 30,
               });
               //get Unit List
               axios
                  .get('/measuring-units/measuring-units')
                  .then((res) => {
                     this.setState({
                        unitList: [...res.data.MeasuringUnits],
                        progress: 60,
                     });
                     //get Vendor List
                     axios
                        .get('/vendors/vendors')
                        .then((res) => {
                           this.setState({
                              vendorList: [...res.data.Vendors],
                              progress: 90,
                           });
                           //get Request Details
                           axios.get('/request-details').then((res) => {
                              let temp = [];
                              console.log('Details: ', res.data);
                              for (let i = 0; i < res.data.length; i++) {
                                 if (
                                    res.data[i].Status === 'ForwardedToFinance'
                                 ) {
                                    res.data[
                                       i
                                    ].Raw_Material_Id = this.getMaterialName(
                                       res.data[i].Raw_Material_Id
                                    );
                                    res.data[i].Measuring_Unit = this.getUnit(
                                       res.data[i].Measuring_Unit
                                    );
                                    res.data[i].Vendor = this.getVendor(
                                       res.data[i].Vendor
                                    );
                                    temp.push(res.data[i]);
                                 }
                              }
                              this.setState({
                                 data: temp,
                                 msg: 'Data Not Found!',
                                 progress: 100,
                                 isLoading: false,
                              });
                           });
                        })
                        .catch((err) => {
                           console.log('cannot get vendorList', err);
                        });
                  })
                  .catch((err) => {
                     console.log('cannot get unitList', err);
                  });
            })
            .catch((err) => {
               console.log('cannot get materialList', err);
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
            <Box fontSize='30px' mb={2} fontWeight='bold'>
               Request Details
            </Box>
            <Box width='90%' display='flex' flexDirection='row'>
               <Button
                  variant='contained'
                  color='primary'
                  style={{
                     marginBottom: '10px',
                     display: 'flex',
                     marginRight: '10px',
                  }}
                  size='small'
                  onClick={this.loadDetails}
               >
                  Purchase Details
               </Button>
               <Button
                  variant='contained'
                  color='primary'
                  size='small'
                  style={{
                     marginBottom: '10px',
                     display: 'flex',
                  }}
                  onClick={this.handleClose}
               >
                  Request Details
               </Button>
            </Box>
            <MaterialTable
               title=' '
               isLoading={this.state.isLoading}
               columns={this.state.columns}
               data={this.state.data}
               style={{ width: '90%', maxHeight: '500px', overflow: 'auto' }}
               localization={{
                  body: {
                     emptyDataSourceMessage: this.state.msg,
                  },
               }}
               components={{
                  OverlayLoading: (props) => (
                     <LinearProgress
                        variant='determinate'
                        value={this.state.progress}
                     ></LinearProgress>
                  ),
               }}
               options={{
                  sorting: true,
                  headerStyle: {
                     backgroundColor: '#3f51b5',
                     color: '#FFF',
                     fontSize: 'medium',
                     fontWeight: 'bold',
                  },
               }}
               actions={[
                  {
                     icon: 'edit',
                     tooltip: 'Edit User',
                     onClick: (event, rowData) => {
                        if (rowData.Status === 'ForwardedToFinance') {
                           this.setState({
                              logComments: rowData.Comments,
                              from: rowData.From,
                              to: rowData.To,
                              uploadFile: 'flex',
                              fieldDisabled: {
                                 quantity: false,
                                 unit: false,
                                 vendor: true,
                                 amount: true,
                                 status: false,
                                 comment: false,
                                 btnDisplay: 'flex',
                                 btnText: 'Cancel',
                              },
                           });
                           this.OnEditHandler(event, rowData);
                        } else {
                           this.setState({ alert: true });
                        }
                     },
                  },
               ]}
               onRowClick={(event, rowData) => {
                  this.setState({
                     logComments: rowData.Comments,
                     from: rowData.From,
                     to: rowData.To,
                     uploadFile: 'none',
                     fieldDisabled: {
                        quantity: true,
                        unit: true,
                        vendor: true,
                        amount: true,
                        status: true,
                        comment: true,
                        btnDisplay: 'none',
                        btnText: 'Close',
                     },
                  });
                  this.OnEditHandler(event, rowData);
               }}
            />
            <Dialog open={this.state.openEdit} maxWidth='lg' fullWidth>
               <DialogContent style={{ padding: '20px' }}>
                  <EditPurchase
                     disabled={this.state.fieldDisabled}
                     dept='Finance'
                     uploadFile='none'
                     From={this.state.from}
                     To={this.state.to}
                     logComments={this.state.logComments}
                     Finance={this.EditData}
                     cancel={() => {
                        this.setState({
                           openEdit: false,
                        });
                        this.handleClose();
                     }}
                  />
               </DialogContent>
            </Dialog>
            <Snackbar
               open={this.state.alert}
               autoHideDuration={3000}
               anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
               onClose={this.closeAlert}
            >
               <Alert
                  severity='error'
                  variant='filled'
                  onClose={this.closeAlert}
               >
                  You cannot modify / reject this record
               </Alert>
            </Snackbar>
         </Box>
      );
   }
}
