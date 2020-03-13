import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import AddWastage from './Add_Wastage';
import EditWastage from './Edit_Wastage';

export default class ManageWastage extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'Wastage Type', field: 'Wastage_Type' },
            // { title: "Wastage Id", field: "Id" },
            { title: 'Item Name', field: 'Item_Name' },
            { title: 'Quantity', field: 'Quantity' },
            { title: 'Measuring Unit', field: 'Measuring_Unit' }
         ],
         data: [],
         openAdd: false,
         openEdit: false,
         fieldDisabled: {
            Wastage_Type: false,
            Product_Name: false,
            Raw_Material_Id: false,
            Quantity: false,
            Id_Type: false,
            Id: false,
            Measuring_Unit: false,
            Wastage_Date: false,
            Description: false,
            btnDisplay: 'none',
            btnText: 'Close'
         }
      };
      this.OnEditHandler = (event, rowData) => {
         axios
            .post('/wastage', {
               _id: rowData._id
            })
            .then(res => {
               //console.log(Wastage);
               this.EditData = { ...res.data[0] };
               console.log(this.EditData);
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios.get('/wastage').then(res => {
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
               if (res.data[i].Product_Name !== '') {
                  axios
                     .post('/products/product', {
                        _id: res.data[i].Product_Name
                        //_id: res.data[i].Product_ID
                     })
                     .then(ProductName => {
                        console.log(ProductName.data.Product[0].product_name);
                        if (ProductName.data.Product) {
                           console.log(
                              ProductName.data.Product[0].product_name
                           );
                           res.data[i].Item_Name =
                              ProductName.data.Product[0].product_name;
                           this.setState({
                              data: [...res.data]
                           });
                        } else {
                           res.data[i].Item_Name = 'problem loading';
                           this.setState({
                              data: [...res.data]
                           });
                        }
                     });
               }
               //end
               //Axios
               else {
                  axios
                     .post('/raw-materials/raw-material', {
                        _id: res.data[i].Raw_Material_Id
                        //_id: res.data[i].Product_ID
                     })
                     .then(MaterialId => {
                        console.log(MaterialId);
                        if (MaterialId.data.RawMaterial[0]) {
                           console.log(
                              MaterialId.data.RawMaterial[0].raw_material_name
                           );
                           res.data[i].Item_Name =
                              MaterialId.data.RawMaterial[0].raw_material_name;
                           this.setState({
                              data: [...res.data]
                           });
                        } else {
                           res.data[i].Item_Name = 'problem loading';
                           this.setState({
                              data: [...res.data]
                           });
                        }
                     });
               }
               //end
            }
            // this.setState({
            //   data: [...res.data]
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
               Manage Wastage
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
               // actions={[
               //   {
               //     icon: "edit",
               //     tooltip: "Edit User",
               //     onClick: (event, rowData) => {
               //       this.setState({
               //         fieldDisabled: {
               //           Wastage_Type: false,
               //           Product_Name: false,
               //           Raw_Material_Id: false,
               //           Quantity: false,
               //           Id_Type: false,
               //           Id: false,
               //           Measuring_Unit: false,
               //           Wastage_Date: false,
               //           Description: false,
               //           btnDisplay: "flex",
               //           btnText: "Cancel"
               //         }
               //       });
               //       this.OnEditHandler(event, rowData);
               //     }
               //   }
               // ]}
               // editable={{
               //   onRowDelete: oldData =>
               //     axios
               //       .post("/wastage/delete", {
               //         _id: oldData._id
               //       })
               //       .then(Wastage => {
               //         console.log(Wastage);
               //         if (Wastage) {
               //           this.setState(prevState => {
               //             const data = [...prevState.data];
               //             data.splice(data.indexOf(oldData), 1);
               //             return { ...prevState, data };
               //           });
               //         }
               //       })
               // }}
               onRowClick={(event, rowData) => {
                  this.setState({
                     fieldDisabled: {
                        Wastage_Type: true,
                        Product_Name: true,
                        Raw_Material_Id: true,
                        Quantity: true,
                        Id_Type: true,
                        Id: true,
                        Measuring_Unit: true,
                        Wastage_Date: true,
                        Description: true,
                        btnDisplay: 'none',
                        btnText: 'Close'
                     }
                  });
                  this.OnEditHandler(event, rowData);
               }}
            />
            <Dialog open={this.state.openAdd} maxWidth='md' fullWidth>
               <DialogContent>
                  <AddWastage
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
                  <EditWastage
                     disabled={this.state.fieldDisabled}
                     wastage={this.EditData}
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
