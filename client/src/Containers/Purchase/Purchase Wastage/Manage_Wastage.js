import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent, LinearProgress } from '@material-ui/core';
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
            { title: 'Material Name', field: 'Raw_Material_Id' },
            { title: 'Quantity', field: 'Quantity' },
            { title: 'Measuring Unit', field: 'Measuring_Unit' },
         ],
         data: [],
         msg: 'Fetching Data...',
         materialList: [],
         unitList: [],
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
            btnText: 'Close',
         },
         isLoading: true,
         progress: 0,
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

      this.OnEditHandler = (event, rowData) => {
         axios
            .post('/purchase-wastages', {
               _id: rowData._id,
            })
            .then((res) => {
               //console.log(Wastage);
               this.EditData = { ...res.data[0] };
               console.log(this.EditData);
               this.setState({
                  openEdit: true,
               });
            });
      };

      this.handleClose = () => {
         //get Material List
         axios
            .get('/raw-materials/raw-materials')
            .then((res) => {
               this.setState({
                  materialList: [...res.data.RawMaterials],
                  progress: 45,
               });
               //get Unit List
               axios
                  .get('/measuring-units/measuring-units')
                  .then((res) => {
                     this.setState({
                        unitList: [...res.data.MeasuringUnits],
                        progress: 90,
                     });
                     axios.get('/purchase-wastages').then((res) => {
                        let temp = [];
                        console.log('Wastage Details:', res.data);
                        for (let i = 0; i < res.data.length; i++) {
                           res.data[i].Raw_Material_Id = this.getMaterialName(
                              res.data[i].Raw_Material_Id
                           );
                           res.data[i].Measuring_Unit = this.getUnit(
                              res.data[i].Measuring_Unit
                           );
                           temp.push(res.data[i]);
                        }
                        this.setState({
                           progress: 100,
                           data: temp,
                           msg: 'Data not Found!',
                           isLoading: false,
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
            <Box fontSize='30px' mb={1} fontWeight='bold'>
               Wastage Details
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
                  onClick={() => {
                     this.setState({
                        openAdd: true,
                     });
                  }}
               >
                  Add
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
               options={{
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
               editable={{
                  onRowDelete: (oldData) =>
                     axios
                        .post('/purchase-stocks/wastage-return', {
                           Raw_Material_Code: oldData.Raw_Material_Code,
                           Total_Quantity: oldData.Quantity,
                        })
                        .then((res) => {
                           console.log(res);
                           axios
                              .post('/purchase-wastages/delete', {
                                 _id: oldData._id,
                              })
                              .then(() => {
                                 this.handleClose();
                              });
                        }),
               }}
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
                        btnText: 'Close',
                     },
                  });
                  this.OnEditHandler(event, rowData);
               }}
            />
            <Dialog open={this.state.openAdd} maxWidth='lg' fullWidth>
               <DialogContent>
                  <AddWastage
                     cancel={() => {
                        this.setState({
                           openAdd: false,
                        });
                        this.handleClose();
                     }}
                  />
               </DialogContent>
            </Dialog>
            <Dialog open={this.state.openEdit} maxWidth='lg' fullWidth>
               <DialogContent>
                  <EditWastage
                     disabled={this.state.fieldDisabled}
                     wastage={this.EditData}
                     cancel={() => {
                        this.setState({
                           openEdit: false,
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
