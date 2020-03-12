import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import permissionCheck from '../../Components/Auth/permissionCheck';
import AddCountry from './AddCountry';
import EditCountry from './EditCountry';
import CountryCSVUpload from './CountryCSVUpload';
export default class ManageCountries extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'ID', field: 'id' },
            { title: 'Country Name', field: 'country_name' },
            { title: 'Description', field: 'description' }
         ],
         data: [],
         openAdd: false,
         openEdit: false,
         openUploadCSV: false
      };
      this.OnEditHandler = (event, rowData) => {
         axios
            .post('/countries/country', {
               _id: rowData._id
            })
            .then(country => {
               //console.log(country);
               this.EditData = { ...country.data.Country[0] };
               console.log(this.EditData);
               // this.props.history.push({
               //    pathname: 'manage-countries/edit-country',
               //    state: {
               //       country: this.EditData
               //    }
               // });
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios.get('/countries/countries').then(res => {
            console.log(res.data.Countries);
            for (let i = 0; i < res.data.Countries.length; i++) {
               res.data.Countries[i].id = i + 1;
            }
            this.setState({
               data: [...res.data.Countries]
            });
         });
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Countries')) {
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
               Manage Countries
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
                  Add Countries
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
                        .post('/countries/delete-country', {
                           country_name: oldData.country_name
                        })
                        .then(Country => {
                           console.log(Country);
                           if (Country) {
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
                  <AddCountry
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
                  <EditCountry
                     country={this.EditData}
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
                  <CountryCSVUpload
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
