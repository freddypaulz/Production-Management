import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import permissionCheck from '../../Components/Auth/permissionCheck';
import AddMeasuringUnit from './AddMeasuringUnit';
import EditMeasuringUnit from './EditMeasuringUnit';
export default class ManageMeasuringUnits extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'ID', field: 'id' },
            { title: 'Measuring Unit Name', field: 'measuring_unit_name' },
            { title: 'Description', field: 'description' }
         ],
         data: [],
         openAdd: false,
         openEdit: false,
         openUploadCSV: false
      };
      this.OnEditHandler = (event, rowData) => {
         axios
            .post('/measuring-units/measuring-unit', {
               _id: rowData._id
            })
            .then(res => {
               console.log(res);
               this.EditData = { ...res.data.MeasuringUnit[0] };
               console.log(this.EditData);
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios.get('/measuring-units/measuring-units').then(res => {
            console.log(res.data.MeasuringUnits);
            for (let i = 0; i < res.data.MeasuringUnits.length; i++) {
               res.data.MeasuringUnits[i].id = i + 1;
            }
            this.setState({
               data: [...res.data.MeasuringUnits]
            });
         });
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Measuring Units')) {
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
               Manage Measuring Units
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
                     tooltip: 'Edit User',
                     onClick: (event, rowData) => {
                        this.OnEditHandler(event, rowData);
                     }
                  }
               ]}
               editable={{
                  onRowDelete: oldData =>
                     axios
                        .post('/measuring-units/delete-measuring-unit', {
                           measuring_unit_name: oldData.measuring_unit_name
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
                  <AddMeasuringUnit
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
                  <EditMeasuringUnit
                     MeasuringUnit={this.EditData}
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
