import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import AddRawMaterial from './AddRawMaterial';
import EditRawMaterial from './EditRawMaterial';
import permissionCheck from '../../../Components/Auth/permissionCheck';

export default class ManageRawMaterials extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'ID', field: 'id' },
            { title: 'Name', field: 'raw_material_name' },
            { title: 'Code', field: 'raw_material_code' },
            { title: 'Type', field: 'raw_material_type' },
            { title: 'Measuring Unit', field: 'raw_material_measuring_unit' },
            { title: 'Description', field: 'description' }
         ],
         data: [],
         openAdd: false,
         openEdit: false
      };
      this.OnEditHandler = (event, rowData) => {
         console.log(rowData._id);
         axios
            .post('/raw-materials/raw-material', {
               _id: rowData._id
            })
            .then(res => {
               console.log(res);
               this.EditData = { ...res.data.RawMaterial };
               console.log(this.EditData[0]);
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios
            .get('/raw-materials/raw-materials')
            .then(res => {
               //console.log(res.data.States[0].country_id);
               for (let i = 0; i < res.data.RawMaterials.length; i++) {
                  res.data.RawMaterials[i].id = i + 1;
                  axios
                     .post('/material-types/material-type', {
                        _id: res.data.RawMaterials[i].raw_material_type
                     })
                     .then(MaterialType => {
                        console.log(MaterialType);
                        if (MaterialType.data.MaterialType[0]) {
                           console.log(
                              MaterialType.data.MaterialType[0]
                                 .material_type_name
                           );
                           res.data.RawMaterials[i].raw_material_type =
                              MaterialType.data.MaterialType[0].material_type_name;
                           this.setState({
                              data: [...res.data.RawMaterials]
                           });
                        } else {
                           res.data.RawMaterials[i].material_type =
                              'problem loading Material Type';
                           this.setState({
                              data: [...res.data.RawMaterials]
                           });
                        }
                     });
                  axios
                     .post('/measuring-units/measuring-unit', {
                        _id:
                           res.data.RawMaterials[i].raw_material_measuring_unit
                     })
                     .then(MeasuringUnit => {
                        console.log(MeasuringUnit);
                        if (MeasuringUnit.data.MeasuringUnit[0]) {
                           console.log(
                              MeasuringUnit.data.MeasuringUnit[0]
                                 .measuring_unit_name
                           );
                           res.data.RawMaterials[
                              i
                           ].raw_material_measuring_unit =
                              MeasuringUnit.data.MeasuringUnit[0].measuring_unit_name;
                           this.setState({
                              data: [...res.data.RawMaterials]
                           });
                        } else {
                           res.data.RawMaterials[
                              i
                           ].raw_material_measuring_unit =
                              'problem loading measuring unit';
                           this.setState({
                              data: [...res.data.RawMaterial]
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
      if (permissionCheck(this.props, 'Manage Raw Materials')) {
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
               Manage Raw Materials
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
                        .post('/raw-materials/delete-raw-material', {
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
                  <AddRawMaterial
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
                  <EditRawMaterial
                     RawMaterial={this.EditData[0]}
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
