import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import AddCity from './AddCity';
import EditCity from './EditCity';
import CityCSVUpload from './CityCSVUpload';
import permissionCheck from '../../Components/Auth/permissionCheck';

export default class ManageCities extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'ID', field: 'id' },
            { title: 'City Name', field: 'city_name' },
            { title: 'State Name', field: 'state_id' },
            { title: 'Description', field: 'description' }
         ],
         data: [],
         openAdd: false,
         openEdit: false,
         openUploadCSV: false
      };
      this.CancelToken = axios.CancelToken;
      this.source = this.CancelToken.source();

      this.OnEditHandler = (event, rowData) => {
         console.log(rowData._id);
         axios
            .post(
               '/cities/city',
               {
                  _id: rowData._id
               },
               {
                  cancelToken: this.source.token
               }
            )
            .then(city => {
               console.log(city);
               this.EditData = { ...city.data.city };
               console.log(this.EditData[0]);
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios
            .get('/cities/cities', {
               cancelToken: this.source.token
            })
            .then(res => {
               //console.log(res.data.States[0].country_id);
               for (let i = 0; i < res.data.Cities.length; i++) {
                  res.data.Cities[i].id = i + 1;
                  axios
                     .post(
                        '/states/state',
                        {
                           _id: res.data.Cities[i].state_id
                        },
                        {
                           cancelToken: this.source.token
                        }
                     )
                     .then(state => {
                        console.log(state);
                        if (state.data.state[0]) {
                           console.log(state.data.state[0].state_name);
                           res.data.Cities[i].state_id =
                              state.data.state[0].state_name;
                           this.setState({
                              data: [...res.data.Cities]
                           });
                        } else {
                           res.data.Cities[i].state_id =
                              'problem loading state';
                           this.setState({
                              data: [...res.data.Cities]
                           });
                        }
                     })
                     .catch(err => {
                        console.log(err);
                     });
               }
            })
            .catch(err => {
               console.log('Error');
            });
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Cities')) {
         this.handleClose();
      }
   }
   componentWillUnmount() {
      this.source.cancel('axios call aborted');
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
               Manage City
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
                  Add City
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
               fixed
               title=' '
               columns={this.state.columns}
               data={this.state.data}
               style={{
                  width: '90%',
                  maxHeight: '500px',
                  overflow: 'auto'
               }}
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
                        .post('/cities/delete-city', {
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
                  <AddCity
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
                  <EditCity
                     city={this.EditData[0]}
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
                  <CityCSVUpload
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
