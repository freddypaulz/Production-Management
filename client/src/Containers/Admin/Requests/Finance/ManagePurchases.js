import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, DialogContent, Snackbar, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import EditPurchase from './EditPurchase';
import AddPurchase from './AddPurchase';
import Alert from '@material-ui/lab/Alert';

export default class ManagePurchases extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.req = [];
      this.state = {
         columns: [
            { title: 'Material', field: 'Raw_Material_Name' },
            { title: 'Quantity', field: 'Quantity' },
            { title: 'Measuring Unit', field: 'Measuring_Unit_Name' },
            { title: 'Vendor', field: 'Vendor_Name' },
            { title: 'Total Price', field: 'Total_Price' },
            { title: 'Priority', field: 'Priority' },
            { title: 'Status', field: 'Status' }
         ],

         data: [],
         openAdd: false,
         openEdit: false,
         openAll: false,
         alert: false,
         fieldDisabled: {
            quantity: false,
            unit: false,
            vendor: false,
            amount: false,
            status: false,
            comment: false,
            btnDisplay: 'none',
            btnText: 'Close'
         },
         found: false,
         msg: 'Fetching Data...'
      };
      this.closeAlert = () => {
         this.setState({ alert: false });
      };

      this.OnEditHandler = (event, rowData) => {
         axios
            .post('/request-details', {
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

      this.loadRawMaterial = RequestDetail => {
         axios
            .post('/raw-materials/raw-material', {
               _id: RequestDetail.Raw_Material_Id
            })
            .then(RawMaterial => {
               RequestDetail.Raw_Material_Name =
                  RawMaterial.data.RawMaterial[0].raw_material_name;
               this.req.push(RequestDetail);
               this.setState({
                  data: [...this.req]
               });
            })
            .catch(err => {
               RequestDetail.Raw_Material_Name = 'Problem Loading Raw Material';
               this.req.push(RequestDetail);
               this.setState({
                  data: [...this.req]
               });
            });
      };

      this.loadMeasuringUnit = RequestDetail => {
         axios
            .post('/measuring-units/measuring-unit', {
               _id: RequestDetail.Measuring_Unit
            })
            .then(MeasuringUnit => {
               RequestDetail.Measuring_Unit_Name =
                  MeasuringUnit.data.MeasuringUnit[0].measuring_unit_name;
               this.loadRawMaterial(RequestDetail);
            })
            .catch(err => {
               RequestDetail.Measuring_Unit_Name =
                  'Problem Loading Measuring Unit';
               this.loadRawMaterial(RequestDetail);
            });
      };

      this.loadVendor = RequestDetail => {
         axios
            .post('/vendors/vendor', {
               _id: RequestDetail.Vendor
            })
            .then(vendor => {
               RequestDetail.Vendor_Name = vendor.data.Vendor[0].vendor_name;
               this.loadMeasuringUnit(RequestDetail);
            })
            .catch(err => {
               RequestDetail.Vendor_Name = 'Problem Loading Vendor';
               this.loadMeasuringUnit(RequestDetail);
            });
      };

      this.handleClose = () => {
         this.req = [];
         this.setState({
            msg: 'Fetching Data...'
         });
         axios.get('/request-details').then(RequestDetails => {
            if (RequestDetails.data[0] !== undefined) {
               RequestDetails.data.map(RequestDetail => {
                  if (this.props.load) {
                     if (RequestDetail.Status !== 'Completed') {
                        this.loadVendor(RequestDetail);
                        this.setState({
                           found: true
                        });
                     }
                     if (this.state.found) {
                        this.setState({
                           msg: 'Loading....'
                        });
                     } else {
                        this.setState({
                           msg: 'No data Found!'
                        });
                     }
                  } else {
                     console.log(
                        `1: ${
                           RequestDetail.Created_By.Role_Id
                        } 2:${sessionStorage.getItem('Role ID')}`
                     );
                     if (
                        RequestDetail.Status === 'ForwardedToAdmin' ||
                        RequestDetail.Created_By.Role_Id ===
                           sessionStorage.getItem('Role ID')
                     ) {
                        this.setState({
                           found: true
                        });
                        this.loadVendor(RequestDetail);
                     }
                     if (this.state.found) {
                        this.setState({
                           msg: 'Loading....'
                        });
                     } else {
                        this.setState({
                           msg: 'No data Found!'
                        });
                     }
                  }
                  this.setState({
                     data: [...this.req]
                  });

                  return null;
               });
            } else {
               this.setState({
                  msg: 'No data Found!'
               });
            }
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
            <Box fontSize='30px' mb={3} fontWeight='bold'>
               Request Details
            </Box>
            {!this.props.load ? (
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
                           openAll: true
                        });
                     }}
                  >
                     All Requests
                  </Button>
               </Box>
            ) : null}
            <MaterialTable
               title=' '
               columns={this.state.columns}
               data={this.state.data}
               style={{ width: '90%', maxHeight: '500px', overflow: 'auto' }}
               localization={{
                  body: {
                     emptyDataSourceMessage: this.state.msg
                  }
               }}
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
                        if (
                           rowData.Status === 'ForwardedToAdmin' ||
                           rowData.Status === 'ForwardedToFinance' ||
                           rowData.Status === 'ForwardedToPurchase' ||
                           rowData.Status === 'Requesting' ||
                           rowData.Status === 'Rejected' ||
                           rowData.Status === 'Finance-Accepted'
                        ) {
                           this.setState({
                              fieldDisabled: {
                                 quantity: false,
                                 unit: false,
                                 vendor: false,
                                 amount: false,
                                 status: false,
                                 comment: false,
                                 btnDisplay: 'flex',
                                 btnText: 'Cancel'
                              }
                           });
                           this.OnEditHandler(event, rowData);
                        } else {
                           this.setState({ alert: true });
                        }
                     }
                  }
               ]}
               onRowClick={(event, rowData) => {
                  this.setState({
                     fieldDisabled: {
                        quantity: true,
                        unit: true,
                        vendor: true,
                        amount: true,
                        status: true,
                        comment: true,
                        btnDisplay: 'none',
                        btnText: 'Close'
                     }
                  });
                  this.OnEditHandler(event, rowData);
               }}
            />
            <Dialog open={this.state.openAll} maxWidth='lg' fullWidth>
               <DialogContent style={{ padding: '20px' }}>
                  <Box>
                     <ManagePurchases load={true} />
                     <Box
                        width='95%'
                        display='flex'
                        justifyContent='flex-end'
                        marginTop='20px'
                     >
                        <Button
                           variant='contained'
                           color='primary'
                           size='large'
                           onClick={() => {
                              this.setState({
                                 openAll: false
                              });
                           }}
                        >
                           Close
                        </Button>
                     </Box>
                  </Box>
               </DialogContent>
            </Dialog>
            <Dialog open={this.state.openEdit} maxWidth='lg' fullWidth>
               <DialogContent>
                  <EditPurchase
                     disabled={this.state.fieldDisabled}
                     Purchase={this.EditData}
                     cancel={() => {
                        this.setState({
                           openEdit: false
                        });
                        this.handleClose();
                     }}
                  />
               </DialogContent>
            </Dialog>
            <Dialog open={this.state.openAdd} maxWidth='lg' fullWidth>
               <DialogContent>
                  <AddPurchase
                     disabled={false}
                     Purchase={this.EditData}
                     cancel={() => {
                        this.setState({
                           openAdd: false
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
