import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import AddState from './AddState';
import EditState from './EditState';
import StateCSVUpload from './StateCSVUpload';
import permissionCheck from '../../Components/Auth/permissionCheck';

export default class ManageStates extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'ID', field: 'id' },
            { title: 'State Name', field: 'state_name' },
            { title: 'Country Name', field: 'country_id' },
            { title: 'Description', field: 'description' }
         ],
         data: [],
         openAdd: false,
         openEdit: false,
         openUploadCSV: false,
         samp: 'hello'
      };
      this.OnEditHandler = (event, rowData) => {
         console.log(rowData._id);
         axios
            .post('/states/state', {
               _id: rowData._id
            })
            .then(state => {
               console.log(state);
               this.EditData = { ...state.data.state };
               console.log(this.EditData[0]);
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios
            .get('/states/states')
            .then(res => {
               //console.log(res.data.States[0].country_id);
               for (let i = 0; i < res.data.States.length; i++) {
                  res.data.States[i].id = i + 1;
                  axios
                     .post('/countries/country', {
                        _id: res.data.States[i].country_id
                     })
                     .then(country => {
                        if (country.data.Country[0]) {
                           console.log(country.data.Country[0].country_name);
                           res.data.States[i].country_id =
                              country.data.Country[0].country_name;
                           this.setState({
                              data: [...res.data.States]
                           });
                        } else {
                           res.data.States[i].country_id =
                              'problem loading country';
                           this.setState({
                              data: [...res.data.States]
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
      if (permissionCheck(this.props, 'Manage States')) {
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
               Manage State
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
                  Add State
               </Button>
               <Button
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
                        .post('/states/delete-state', {
                           state_name: oldData.state_name
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
                  <AddState
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
                  <EditState
                     state={this.EditData[0]}
                     cancel={() => {
                        this.setState({
                           openEdit: false
                        });
                        this.handleClose();
                     }}
                  />
               </DialogContent>
            </Dialog>
            <Dialog open={this.state.openUploadCSV} maxWidth='sm' fullWidth>
               <DialogContent style={{ padding: '20px' }}>
                  <StateCSVUpload
                     cancel={() => {
                        this.setState({
                           openUploadCSV: false
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
