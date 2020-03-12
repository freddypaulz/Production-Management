import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import permissionCheck from '../../Components/Auth/permissionCheck';
import AddProductionUnit from './AddProductionUnit';
import EditProductionUnit from './EditProductionUnit';
export default class ManageProductionUnit extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'ID', field: 'id' },
            { title: 'Production Unit Name', field: 'production_unit_name' },
            { title: 'Description', field: 'description' }
         ],
         data: [],
         openAdd: false,
         openEdit: false
      };
      this.OnEditHandler = (event, rowData) => {
         axios
            .post('/production-units/production-unit', {
               _id: rowData._id
            })
            .then(ProductionUnit => {
               this.EditData = { ...ProductionUnit.data.ProductionUnit[0] };
               console.log(this.EditData);
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios.get('/production-units/production-units').then(res => {
            console.log(res.data.ProductionUnits);
            for (let i = 0; i < res.data.ProductionUnits.length; i++) {
               res.data.ProductionUnits[i].id = i + 1;
            }
            this.setState({
               data: [...res.data.ProductionUnits]
            });
         });
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Production Units')) {
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
               Manage Production Units
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
                        .post('/production-units/delete-production-unit', {
                           production_unit_name: oldData.production_unit_name
                        })
                        .then(ProductionUnit => {
                           console.log(ProductionUnit);
                           if (ProductionUnit) {
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
                  <AddProductionUnit
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
                  <EditProductionUnit
                     ProductionUnit={this.EditData}
                     props={this.props}
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
