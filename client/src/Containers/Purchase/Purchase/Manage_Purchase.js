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
import EditPurchase from './Edit_Purchase';
import Alert from '@material-ui/lab/Alert';

export default class ManagePurchase extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'Material Name', field: 'Raw_Material_Id' },
            { title: 'Quantity', field: 'Quantity' },
            { title: 'Measuring Unit', field: 'Measuring_Unit' },
            { title: 'Status', field: 'Status' },
            { title: 'Comments', field: 'Comments' },
         ],
         data: [],
         msg: 'Fetching Data...',
         openAdd: false,
         openEdit: false,
         alert: false,
         vendorList: [],
         unitList: [],
         materialList: [],
         stockList: [],
         roleList: [],
         role: '',
         reqDetails: [],
         availStock: null,
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
         logComments: '',
         temp: [],
         isLoading: true,
         progress: 0,
      };

      this.closeAlert = () => {
         this.setState({ alert: false });
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

      this.getMaterialDetails = (id) => {
         let temp = id;
         this.state.materialList.map((material) => {
            if (material._id === id) {
               temp = material.raw_material_code;
            }
            return null;
         });
         return temp;
      };

      this.getDetails = (id) => {
         let temp = id;
         console.log('reqdetails:', this.state.reqDetails);
         this.state.reqDetails.map((details) => {
            if (details._id === id) {
               temp = this.getMaterialDetails(details.Raw_Material_Id);
            }
            return null;
         });
         return temp;
      };

      this.getStockDetails = (id) => {
         console.log('stockList:', this.state.stockList);
         let temp = 0;
         let rcode = this.getDetails(id);
         this.state.stockList.map((stock) => {
            let scode = this.getDetails(stock.Purchase_Id);
            console.log('scode:', scode, rcode);
            if (scode === rcode) {
               temp = stock.Total_Quantity;
            }
            return null;
         });
         return temp;
      };

      this.getRoles = (id) => {
         let temp = id;
         this.state.roleList.map((role) => {
            if (role._id === id) {
               temp = role.role_name;
            }
            return null;
         });
         return temp;
      };

      this.loadFinanceAccepted = () => {
         let temp = [];
         console.log('reqDetails:', this.state.reqDetails);
         this.state.reqDetails.map((details) => {
            if (details.Status === 'Finance-Accepted') {
               details.Raw_Material_Id = this.getMaterialName(
                  details.Raw_Material_Id
               );
               details.Measuring_Unit = this.getUnit(details.Measuring_Unit);
               temp.push(details);
            }
            this.setState({
               data: temp,
            });
            this.setState({
               msg: 'Data not Found!',
            });
            return null;
         });
      };

      this.loadRequest = () => {
         let temp = [];
         console.log('reqDetails:', this.state.reqDetails);
         this.state.reqDetails.map((details) => {
            if (
               details.Status === 'Requesting' ||
               details.Status === 'ForwardedToPurchase'
            ) {
               details.Raw_Material_Id = this.getMaterialName(
                  details.Raw_Material_Id
               );
               details.Measuring_Unit = this.getUnit(details.Measuring_Unit);
               temp.push(details);
            }
            this.setState({
               data: temp,
            });
            return null;
         });
      };

      this.handleClose = () => {
         //get Material List
         axios
            .get('/raw-materials/raw-materials')
            .then((res) => {
               this.setState({
                  materialList: [...res.data.RawMaterials],
                  progress: 20,
               });
               //get Unit List
               axios
                  .get('/measuring-units/measuring-units')
                  .then((res) => {
                     this.setState({
                        unitList: [...res.data.MeasuringUnits],
                        progress: 40,
                     });
                     //get Vendor List
                     axios.get('/vendors/vendors').then((res) => {
                        this.setState({
                           vendorList: [...res.data.Vendors],
                           progress: 60,
                        });
                        //get Stock Details
                        axios.get('/purchase-stocks').then((resp) => {
                           this.setState({
                              stockList: [...resp.data.stock],
                              progress: 80,
                           });
                           //get Roles
                           axios
                              .get('/roles/roles')
                              .then((res) => {
                                 this.setState({
                                    roleList: [...res.data.Roles],
                                    progress: 90,
                                 });
                                 //get Request Details
                                 axios.get('/request-details').then((res) => {
                                    let temp = [];
                                    console.log('Details: ', res.data);
                                    for (let i = 0; i < res.data.length; i++) {
                                       res.data[
                                          i
                                       ].Raw_Material_Id = this.getMaterialName(
                                          res.data[i].Raw_Material_Id
                                       );
                                       res.data[
                                          i
                                       ].Measuring_Unit = this.getUnit(
                                          res.data[i].Measuring_Unit
                                       );
                                       res.data[i].Vendor = this.getVendor(
                                          res.data[i].Vendor
                                       );
                                       temp.push(res.data[i]);
                                    }
                                    this.setState({
                                       progress: 100,
                                       data: temp,
                                       reqDetails: [...res.data],
                                       isLoading: false,
                                    });
                                 });
                              })
                              .catch((err) => {
                                 console.log('cannot get roleList', err);
                              });
                        });
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
                  onClick={this.loadFinanceAccepted}
               >
                  Finance Accepted
               </Button>
               <Button
                  variant='contained'
                  color='primary'
                  size='small'
                  style={{
                     marginBottom: '10px',
                     display: 'flex',
                  }}
                  onClick={this.loadRequest}
               >
                  Request Details
               </Button>
               <Button
                  variant='contained'
                  color='primary'
                  size='small'
                  style={{
                     marginBottom: '10px',
                     display: 'flex',
                     marginLeft: '10px',
                  }}
                  onClick={this.handleClose}
               >
                  All
               </Button>
            </Box>
            <Box width='90%' display='flex' flexDirection='row'>
               <MaterialTable
                  title=' '
                  isLoading={this.state.isLoading}
                  columns={this.state.columns}
                  data={this.state.data}
                  style={{
                     width: '100%',
                     maxHeight: '500px',
                     overflow: 'auto',
                  }}
                  localization={{
                     body: {
                        emptyDataSourceMessage: this.state.msg,
                     },
                  }}
                  options={{
                     loadingType: 'overlay',
                     sorting: true,
                     headerStyle: {
                        backgroundColor: '#3f51b5',
                        color: '#FFF',
                        fontSize: 'medium',
                        fontWeight: 'bold',
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
                  actions={[
                     {
                        icon: 'edit',
                        tooltip: 'Edit User',
                        onClick: (event, rowData) => {
                           this.setState({
                              availStock: this.getStockDetails(rowData._id),
                              role: this.getRoles(rowData.Created_By.Role_Id),
                           });
                           if (
                              rowData.Status === 'Requesting' ||
                              rowData.Status === 'ForwardedToPurchase' ||
                              rowData.Status === 'Finance-Accepted'
                           ) {
                              if (
                                 rowData.Status === 'Finance-Accepted' ||
                                 (this.getStockDetails(rowData._id) >=
                                    rowData.Quantity &&
                                    this.getRoles(
                                       rowData.Created_By.Role_Id
                                    ) !== 'Admin')
                              ) {
                                 console.log(
                                    'Role:',
                                    this.getRoles(rowData.Created_By.Role_Id)
                                 );
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
                              } else {
                                 console.log(
                                    'Role:',
                                    this.getRoles(rowData.Created_By.Role_Id)
                                 );
                                 this.setState({
                                    logComments: rowData.Comments,
                                    from: rowData.From,
                                    to: rowData.To,
                                    uploadFile: 'flex',
                                    fieldDisabled: {
                                       quantity: false,
                                       unit: false,
                                       vendor: false,
                                       amount: false,
                                       status: false,
                                       comment: false,
                                       btnDisplay: 'flex',
                                       btnText: 'Cancel',
                                    },
                                 });
                                 this.OnEditHandler(event, rowData);
                              }
                           } else {
                              this.setState({ alert: true });
                           }
                        },
                     },
                  ]}
                  onRowClick={(event, rowData) => {
                     this.setState({
                        availStock: this.getStockDetails(rowData._id),
                        role: this.getRoles(rowData.Created_By.Role_Id),
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
            </Box>

            <Dialog open={this.state.openEdit} maxWidth='lg' fullWidth>
               <DialogContent style={{ padding: '20px' }}>
                  <EditPurchase
                     disabled={this.state.fieldDisabled}
                     dept='Purchase'
                     uploadFile={this.state.uploadFile}
                     From={this.state.from}
                     To={this.state.to}
                     logComments={this.state.logComments}
                     Purchase={this.EditData}
                     vendorRecord={() => {
                        let temp = [];
                        this.state.vendorList.map((vendor) => {
                           console.log('EditData:', this.EditData.Vendor);
                           if (vendor._id === this.EditData.Vendor) {
                              temp = vendor;
                           }
                           return null;
                        });
                        return temp;
                     }}
                     availStock={this.state.availStock}
                     role={this.state.role}
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
