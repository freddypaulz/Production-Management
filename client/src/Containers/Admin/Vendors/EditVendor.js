import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   FormControl,
   LinearProgress,
} from '@material-ui/core';
import { PaperBoard } from '../../../Components/PaperBoard/PaperBoard';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import axios from 'axios';
import Styles from '../../../Components/styles/FormStyles';
import permissionCheck from '../../../Components/Auth/permissionCheck';
import Autocomplete from '@material-ui/lab/Autocomplete';

const styles = Styles;
export default class EditVendor extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         vendor_name: '',
         vendor_location: '',
         vendor_tax_no: '',
         vendor_mobile_no: '',
         vendor_email: '',
         vendor_address: '',
         vendor_country: '',
         vendor_state: '',
         vendor_city: '',
         vendor_postal_code: '',
         vendor_point_of_contacts: [
            {
               name: '',
               designation: '',
               mobile_no: '',
               sec_mobile_no: '',
            },
         ],
         description: '',
         errors: [],
         fieldErrors: {
            vendor_name: false,
            vendor_location: false,
            vendor_tax_no: false,
            vendor_mobile_no: false,
            vendor_email: false,
            vendor_address: false,
            vendor_country: false,
            vendor_state: false,
            vendor_city: false,
            vendor_postal_code: false,
            vendor_point_of_contacts: false,
         },
         countries: [],
         states: [],
         cities: [],
         poc_name: '',
         poc_designation: '',
         poc_mobile_no: '',
         dataReceived: false,
         poc_sec_mobile_no: '',
      };
      this.onGetCountry = (_id) => {
         axios
            .post('/countries/country', {
               _id,
            })
            .then((res) => {
               console.log(res.data.Country[0]);
               this.setState({
                  vendor_country: res.data.Country[0],
               });
            });
      };
      this.onGetState = (_id) => {
         axios
            .post('/states/state', {
               _id,
            })
            .then((res) => {
               console.log(res.data.state);
               this.setState({
                  vendor_state: res.data.state[0],
               });
            });
      };
      this.onGetCity = (_id) => {
         axios
            .post('/cities/city', {
               _id,
            })
            .then((res) => {
               this.setState({
                  vendor_city: res.data.city[0],
               });
            });
      };
      this.onEditHandler = () => {
         this.state.vendor_point_of_contacts.map((poc, index) => {
            const { name, mobile_no } = poc;
            if (!name && !mobile_no) {
               this.state.vendor_point_of_contacts.splice(index, 1);
            }
            return null;
         });
         console.log(this.state.vendor_point_of_contacts);
         this.setState({
            dataReceived: false,
         });
         axios
            .post('/vendors/edit-vendor', {
               _id: this.state._id,
               vendor_name: this.state.vendor_name,
               vendor_location: this.state.vendor_location,
               vendor_tax_no: this.state.vendor_tax_no,
               vendor_mobile_no: this.state.vendor_mobile_no,
               vendor_email: this.state.vendor_email,
               vendor_address: this.state.vendor_address,
               vendor_country: this.state.vendor_country,
               vendor_state: this.state.vendor_state,
               vendor_city: this.state.vendor_city,
               vendor_postal_code: this.state.vendor_postal_code,
               vendor_point_of_contact: this.state.vendor_point_of_contacts,
               description: this.state.description,
            })
            .then((res) => {
               console.log(res);
               if (res.data.errors) {
                  if (res.data.errors.length > 0) {
                     console.log(res.data.errors);
                     this.setState({
                        errors: [...res.data.errors],
                        dataReceived: true,
                     });
                  } else {
                     this.setState({
                        dataReceived: true,
                     });
                     this.props.cancel();
                  }
               }
            })
            .catch((err) => console.log(err));
      };
   }
   componentDidMount() {
      console.log(this.props.Vendor);
      console.log(this.props.Vendor.vendor_point_of_contact);
      if (permissionCheck(this.props, 'Manage Vendors')) {
         this.setState({
            dataReceived: false,
         });
         axios.get('/countries/countries').then((res) => {
            this.setState({
               countries: [...res.data.Countries],
            });
            this.onGetCountry(this.props.Vendor.vendor_country);
            axios
               .post('/states/state-country', {
                  country_id: this.props.Vendor.vendor_country,
               })
               .then((states) => {
                  this.setState({
                     states: [...states.data.state],
                  });
                  this.onGetState(this.props.Vendor.vendor_state);
                  axios
                     .post('/cities/city-state', {
                        state_id: this.props.Vendor.vendor_state,
                     })
                     .then((cities) => {
                        this.setState({
                           cities: [...cities.data.city],
                        });
                        this.onGetCity(this.props.Vendor.vendor_city);
                        if (this.state.vendor_name === '') {
                           this.setState({
                              _id: this.props.Vendor._id,
                              vendor_name: this.props.Vendor.vendor_name,
                              vendor_location: this.props.Vendor
                                 .vendor_location,
                              vendor_tax_no: this.props.Vendor.vendor_tax_no,
                              vendor_mobile_no: this.props.Vendor
                                 .vendor_mobile_no,
                              vendor_email: this.props.Vendor.vendor_email,
                              vendor_address: this.props.Vendor.vendor_address,
                              vendor_postal_code: this.props.Vendor
                                 .vendor_postal_code,
                              vendor_point_of_contacts: this.props.Vendor
                                 .vendor_point_of_contact,
                              description: this.props.Vendor.description,
                              dataReceived: true,
                           });
                        }
                     });
               });
         });
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Edit Vendor
            </Box>
            {this.state.errors.length > 0
               ? this.state.errors.map((error, index) => {
                    return (
                       <Box
                          style={styles.box_msg}
                          bgcolor='#f73067'
                          key={index}
                       >
                          {error}
                       </Box>
                    );
                 })
               : null}
            <Box width='94%'>
               {!this.state.dataReceived ? <LinearProgress /> : null}
            </Box>
            <PaperBoard>
               <Box style={styles.box_field}>
                  <Box style={styles.box} marginRight='10px'>
                     <TextField
                        size='small'
                        fullWidth
                        required
                        value={this.state.vendor_name}
                        variant='outlined'
                        label='Vendor Name'
                        type='text'
                        onChange={(event) => {
                           this.setState({
                              vendor_name: event.target.value,
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={styles.box} marginRight='10px'>
                     <TextField
                        size='small'
                        fullWidth
                        required
                        value={this.state.vendor_location}
                        variant='outlined'
                        label='Location'
                        type='text'
                        onChange={(event) => {
                           this.setState({
                              vendor_location: event.target.value,
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={styles.box}>
                     <TextField
                        size='small'
                        fullWidth
                        required
                        value={this.state.vendor_tax_no}
                        variant='outlined'
                        label='Tax Number (GSTIN/VAT)'
                        type='text'
                        onChange={(event) => {
                           this.setState({
                              vendor_tax_no: event.target.value,
                           });
                        }}
                     ></TextField>
                  </Box>
               </Box>
               <Box style={styles.box_field}>
                  <Box style={styles.box} marginRight='10px'>
                     <TextField
                        size='small'
                        fullWidth
                        required
                        value={this.state.vendor_mobile_no}
                        variant='outlined'
                        label='Mobile Number'
                        type='text'
                        onChange={(event) => {
                           this.setState({
                              vendor_mobile_no: event.target.value,
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={styles.box}>
                     <TextField
                        size='small'
                        fullWidth
                        required
                        value={this.state.vendor_email}
                        variant='outlined'
                        label='Email'
                        type='email'
                        onChange={(event) => {
                           this.setState({
                              vendor_email: event.target.value,
                           });
                        }}
                     ></TextField>
                  </Box>
               </Box>

               <Box style={styles.box}>
                  <TextField
                     size='small'
                     fullWidth
                     required
                     value={this.state.vendor_address}
                     variant='outlined'
                     label='Address'
                     type='text'
                     onChange={(event) => {
                        this.setState({
                           vendor_address: event.target.value,
                        });
                     }}
                  ></TextField>
               </Box>
               <Box style={styles.box_field} marginTop='10px'>
                  <Box style={styles.box} marginRight='10px'>
                     <FormControl
                        size='small'
                        variant='outlined'
                        fullWidth
                        display='flex'
                     >
                        <Autocomplete
                           size='small'
                           id='country'
                           disableClearable={true}
                           options={this.state.countries}
                           getOptionLabel={(option) => option.country_name}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 required
                                 label='Select Country'
                                 variant='outlined'
                              />
                           )}
                           value={this.state.vendor_country}
                           onChange={(event, value) => {
                              console.log(value);
                              this.setState({
                                 vendor_country: value,
                                 cities: [],
                                 states: [],
                                 vendor_state: '',
                                 vendor_city: '',
                                 dataReceived: false,
                              });
                              axios
                                 .post('/states/state-country', {
                                    country_id: value,
                                 })
                                 .then((res) => {
                                    console.log(
                                       'test ===>',
                                       this.state.vendor_country
                                    );
                                    this.setState({
                                       states: [...res.data.state],
                                       dataReceived: true,
                                    });
                                 });
                           }}
                        />
                     </FormControl>
                  </Box>
                  <Box style={styles.box} marginRight='10px'>
                     <FormControl
                        size='small'
                        variant='outlined'
                        fullWidth
                        display='flex'
                     >
                        <Autocomplete
                           size='small'
                           id='state'
                           disableClearable={true}
                           options={this.state.states}
                           getOptionLabel={(option) => option.state_name}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 required
                                 label='Select State'
                                 variant='outlined'
                              />
                           )}
                           value={this.state.vendor_state}
                           onChange={(event, value) => {
                              console.log(value);
                              this.setState({
                                 vendor_state: value,
                                 vendor_city: '',
                                 cities: [],
                                 dataReceived: false,
                              });
                              axios
                                 .post('/cities/city-state', {
                                    state_id: value,
                                 })
                                 .then((res) => {
                                    console.log(res);
                                    this.setState({
                                       cities: [...res.data.city],
                                       dataReceived: true,
                                    });
                                 });
                           }}
                        />
                     </FormControl>
                  </Box>
                  <Box style={styles.box}>
                     <FormControl
                        size='small'
                        variant='outlined'
                        fullWidth
                        display='flex'
                     >
                        <Autocomplete
                           size='small'
                           id='city'
                           disableClearable={true}
                           options={this.state.cities}
                           getOptionLabel={(option) => option.city_name}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 required
                                 label='Select City'
                                 variant='outlined'
                              />
                           )}
                           value={this.state.vendor_city}
                           onChange={(event, value) => {
                              console.log(value);
                              this.setState({
                                 vendor_city: value,
                              });
                           }}
                        />
                     </FormControl>
                  </Box>
               </Box>

               <Box style={styles.box_field}>
                  <TextField
                     size='small'
                     fullWidth
                     required
                     value={this.state.vendor_postal_code}
                     variant='outlined'
                     label='Postal Code'
                     type='text'
                     onChange={(event) => {
                        this.setState({
                           vendor_postal_code: event.target.value,
                        });
                     }}
                  ></TextField>
               </Box>
               <Box style={styles.box}>
                  <TextField
                     size='small'
                     fullWidth
                     multiline
                     rowsMax={4}
                     required
                     value={this.state.description}
                     variant='outlined'
                     label='Description'
                     type='text'
                     onChange={(event) => {
                        this.setState({ description: event.target.value });
                     }}
                  ></TextField>
               </Box>
               <Box
                  fontWeight='bold'
                  fontSize='1.2vw'
                  mt={1}
                  mb={1}
                  display='flex'
                  justifyContent='flex-start'
                  width='100%'
               >
                  Point of contact
               </Box>
               <Box
                  style={styles.box_field}
                  padding='10px'
                  border='1px solid #3f51b5'
                  marginBottom='10px'
                  flexDirection='column'
               >
                  {this.state.vendor_point_of_contacts
                     .map((poc, index) => {
                        return (
                           <Box key={index} style={styles.box_field}>
                              <Box style={styles.box} marginRight='10px'>
                                 <TextField
                                    size='small'
                                    fullWidth
                                    required
                                    value={
                                       this.state.vendor_point_of_contacts[
                                          index
                                       ].name
                                    }
                                    variant='outlined'
                                    label='Name'
                                    type='text'
                                    onChange={(event) => {
                                       this.setState({
                                          poc_name: event.target.value,
                                       });
                                       this.setState((prevState) => {
                                          prevState.vendor_point_of_contacts[
                                             index
                                          ].name = prevState.poc_name;
                                          console.log(
                                             prevState.vendor_point_of_contacts[
                                                index
                                             ]
                                          );
                                       });
                                    }}
                                 ></TextField>
                              </Box>
                              <Box style={styles.box} marginRight='10px'>
                                 <TextField
                                    size='small'
                                    fullWidth
                                    required
                                    value={
                                       this.state.vendor_point_of_contacts[
                                          index
                                       ].designation
                                    }
                                    variant='outlined'
                                    label='Designation'
                                    type='text'
                                    onChange={(event) => {
                                       this.setState({
                                          poc_designation: event.target.value,
                                       });
                                       this.setState((prevState) => {
                                          prevState.vendor_point_of_contacts[
                                             index
                                          ].designation =
                                             prevState.poc_designation;
                                          console.log(
                                             prevState.vendor_point_of_contacts[
                                                index
                                             ]
                                          );
                                       });
                                    }}
                                 ></TextField>
                              </Box>
                              <Box style={styles.box} marginRight='10px'>
                                 <TextField
                                    size='small'
                                    fullWidth
                                    required
                                    value={
                                       this.state.vendor_point_of_contacts[
                                          index
                                       ].mobile_no
                                    }
                                    variant='outlined'
                                    label='Mobile No'
                                    type='text'
                                    onChange={(event) => {
                                       this.setState({
                                          poc_mobile_no: event.target.value,
                                       });
                                       this.setState((prevState) => {
                                          prevState.vendor_point_of_contacts[
                                             index
                                          ].mobile_no = prevState.poc_mobile_no;
                                          console.log(
                                             prevState.vendor_point_of_contacts[
                                                index
                                             ]
                                          );
                                       });
                                    }}
                                 ></TextField>
                              </Box>
                              <Box style={styles.box} marginRight='10px'>
                                 <TextField
                                    size='small'
                                    fullWidth
                                    value={
                                       this.state.vendor_point_of_contacts[
                                          index
                                       ].sec_mobile_no
                                    }
                                    variant='outlined'
                                    label='Secondary Mobile No'
                                    type='text'
                                    onChange={(event) => {
                                       this.setState({
                                          poc_sec_mobile_no: event.target.value,
                                       });
                                       this.setState((prevState) => {
                                          prevState.vendor_point_of_contacts[
                                             index
                                          ].sec_mobile_no =
                                             prevState.poc_sec_mobile_no;
                                          console.log(
                                             prevState.vendor_point_of_contacts[
                                                index
                                             ]
                                          );
                                       });
                                    }}
                                 ></TextField>
                              </Box>
                              {/* <Fab
                              variant='extended'
                              color='primary'
                              size='medium'
                           > */}
                              {this.state.vendor_point_of_contacts.length ===
                              index + 1 ? (
                                 <AddBoxOutlinedIcon
                                    color='secondary'
                                    style={{ fontSize: '30px' }}
                                    onClick={() => {
                                       this.setState({});
                                       this.setState((prevState) => {
                                          prevState.vendor_point_of_contacts.push(
                                             {
                                                name: '',
                                                designation: '',
                                                mobile_no: '',
                                                sec_mobile_no: '',
                                             }
                                          );
                                          console.log(
                                             prevState.vendor_point_of_contacts
                                          );
                                       });
                                    }}
                                 />
                              ) : (
                                 <DeleteOutlineIcon
                                    color='secondary'
                                    style={{ fontSize: '30px' }}
                                    onClick={() => {
                                       this.setState({});
                                       this.setState((prevState) => {
                                          prevState.vendor_point_of_contacts.splice(
                                             index,
                                             1
                                          );
                                          console.log(
                                             prevState.vendor_point_of_contacts
                                          );
                                       });
                                    }}
                                 />
                              )}

                              {/* </Fab> */}
                           </Box>
                        );
                     })
                     .reverse()}
               </Box>
            </PaperBoard>
            <Box
               display=' flex'
               marginTop='20px'
               justifyContent='flex-end'
               width='94%'
            >
               <Box marginRight='10px' width='100px'>
                  <Button
                     fullWidth
                     variant='contained'
                     color='primary'
                     size='large'
                     onClick={() => {
                        this.props.cancel();
                     }}
                  >
                     Cancel
                  </Button>
               </Box>
               <Box width='100px'>
                  <Button
                     fullWidth
                     variant='contained'
                     color='primary'
                     size='large'
                     onClick={this.onEditHandler}
                  >
                     Update
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
