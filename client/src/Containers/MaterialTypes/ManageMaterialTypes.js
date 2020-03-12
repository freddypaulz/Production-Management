import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import permissionCheck from '../../Components/Auth/permissionCheck';
import AddMaterialType from './AddMaterialType';
import EditMaterialType from './EditMaterialType';
// import CountryCSVUpload from './CountryCSVUpload';
export default class ManageMaterialTypes extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'ID', field: 'id' },
            { title: 'Material Type Name', field: 'material_type_name' },
            { title: 'Description', field: 'description' }
         ],
         data: [],
         openAdd: false,
         openEdit: false,
         openUploadCSV: false
      };
      this.OnEditHandler = (event, rowData) => {
         axios
            .post('/material-types/material-type', {
               _id: rowData._id
            })
            .then(res => {
               this.EditData = { ...res.data.MaterialType[0] };
               console.log(this.EditData);
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios.get('/material-types/material-types').then(res => {
            console.log(res.data.MaterialTypes);
            for (let i = 0; i < res.data.MaterialTypes.length; i++) {
               res.data.MaterialTypes[i].id = i + 1;
            }
            this.setState({
               data: [...res.data.MaterialTypes]
            });
         });
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Material Types')) {
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
               Manage Material Types
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
               {/* <Button
                  variant='contained'
                  color='primary'
                  style={{
                     marginBottom: '20px',
                     display: 'flex'
                  }}
                  size='large'
                  onClick={() => {
                     this.setState({
                        openUploadCSV: true
                     });
                  }}
               >
                  Upload CSV
               </Button> */}
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
                     tooltip: 'Edit User',
                     onClick: (event, rowData) => {
                        this.OnEditHandler(event, rowData);
                     }
                  }
               ]}
               editable={{
                  onRowDelete: oldData =>
                     axios
                        .post('/material-types/delete-material-type', {
                           material_type_name: oldData.material_type_name
                        })
                        .then(MaterialType => {
                           console.log(MaterialType);
                           if (MaterialType) {
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
                  <AddMaterialType
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
                  <EditMaterialType
                     MaterialType={this.EditData}
                     cancel={() => {
                        this.setState({
                           openEdit: false
                        });
                        this.handleClose();
                     }}
                  />
               </DialogContent>
            </Dialog>
            {/* <Dialog open={this.state.openUploadCSV} maxWidth='sm' fullWidth>
               <DialogContent style={{ padding: '20px' }}>
                  <CountryCSVUpload
                     cancel={() => {
                        this.setState({
                           openUploadCSV: false
                        });
                        this.handleClose();
                     }}
                  />
               </DialogContent>
            </Dialog> */}
         </Box>
      );
   }
}
