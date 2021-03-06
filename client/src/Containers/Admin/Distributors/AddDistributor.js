import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   FormControl,
   LinearProgress,
} from '@material-ui/core';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { PaperBoard } from '../../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../../Components/styles/FormStyles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import permissionCheck from '../../../Components/Auth/permissionCheck';

const styles = Styles;
export default class AddDistributor extends Component {
   constructor(props) {
      super();
      this.state = {
         distributor_name: '',
         distributor_location: '',
         distributor_tax_no: '',
         distributor_mobile_no: '',
         distributor_email: '',
         distributor_address: '',
         distributor_country: '',
         distributor_state: '',
         distributor_city: '',
         distributor_postal_code: '',
         distributor_point_of_contacts: [
            {
               name: '',
               designation: '',
               mobile_no: '',
               sec_mobile_no: '',
            },
         ],
         description: '',
         errors: [],
         countries: [],
         states: [],
         cities: [],
         poc_name: '',
         poc_designation: '',
         poc_mobile_no: '',
         dataReceived: false,
         poc_sec_mobile_no: '',
      };
      this.onAddHandler = () => {
         this.setState({
            dataReceived: false,
         });
         axios
            .post('/distributors/add-distributor', {
               distributor_name: this.state.distributor_name,
               distributor_location: this.state.distributor_location,
               distributor_tax_no: this.state.distributor_tax_no,
               distributor_mobile_no: this.state.distributor_mobile_no,
               distributor_email: this.state.distributor_email,
               distributor_address: this.state.distributor_address,
               distributor_country: this.state.distributor_country,
               distributor_state: this.state.distributor_state,
               distributor_city: this.state.distributor_city,
               distributor_postal_code: this.state.distributor_postal_code,
               distributor_point_of_contact: this.state
                  .distributor_point_of_contacts,
               description: this.state.description,
            })
            .then((res) => {
               console.log(res);
               if (res.data.errors.length > 0) {
                  console.log(res.data.errors);
                  this.setState({
                     dataReceived: true,
                     errors: [...res.data.errors],
                  });
               } else {
                  this.setState({
                     dataReceived: true,
                  });
                  this.props.cancel();
               }
            })
            .catch((err) => console.log(err));
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Distributors')) {
         this.setState({
            dataReceived: false,
         });
         axios.get('/countries/countries').then((res) => {
            this.setState({
               countries: [...res.data.Countries],
               dataReceived: true,
            });
         });
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Distributor
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
                        value={this.state.distributor_name}
                        variant='outlined'
                        label='Distributor Name'
                        type='text'
                        onChange={(event) => {
                           this.setState({
                              distributor_name: event.target.value,
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={styles.box} marginRight='10px'>
                     <TextField
                        size='small'
                        fullWidth
                        required
                        value={this.state.distributor_location}
                        variant='outlined'
                        label='Location'
                        type='text'
                        onChange={(event) => {
                           this.setState({
                              distributor_location: event.target.value,
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={styles.box}>
                     <TextField
                        size='small'
                        fullWidth
                        required
                        value={this.state.distributor_tax_no}
                        variant='outlined'
                        label='Tax Number (GSTIN/VAT)'
                        type='text'
                        onChange={(event) => {
                           this.setState({
                              distributor_tax_no: event.target.value,
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
                        value={this.state.distributor_mobile_no}
                        variant='outlined'
                        label='Mobile Number'
                        type='text'
                        onChange={(event) => {
                           this.setState({
                              distributor_mobile_no: event.target.value,
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={styles.box}>
                     <TextField
                        size='small'
                        fullWidth
                        required
                        value={this.state.distributor_email}
                        variant='outlined'
                        label='Email'
                        type='email'
                        onChange={(event) => {
                           this.setState({
                              distributor_email: event.target.value,
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
                     value={this.state.distributor_address}
                     variant='outlined'
                     label='Address'
                     type='text'
                     onChange={(event) => {
                        this.setState({
                           distributor_address: event.target.value,
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
                           value={this.state.distributor_country}
                           onChange={(event, value) => {
                              console.log(value);
                              this.setState({
                                 distributor_country: value,
                                 cities: [],
                                 states: [],
                                 distributor_state: '',
                                 distributor_city: '',
                                 dataReceived: false,
                              });
                              axios
                                 .post('/states/state-country', {
                                    country_id: value,
                                 })
                                 .then((res) => {
                                    console.log(
                                       'test ===>',
                                       this.state.distributor_country
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
                           value={this.state.distributor_state}
                           onChange={(event, value) => {
                              console.log(value);
                              this.setState({
                                 distributor_state: value,
                                 distributor_city: '',
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
                           value={this.state.distributor_city}
                           onChange={(event, value) => {
                              console.log(value);
                              this.setState({
                                 distributor_city: value,
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
                     value={this.state.distributor_postal_code}
                     variant='outlined'
                     label='Postal Code'
                     type='text'
                     onChange={(event) => {
                        this.setState({
                           distributor_postal_code: event.target.value,
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
                  {this.state.distributor_point_of_contacts
                     .map((poc, index) => {
                        return (
                           <Box style={styles.box_field}>
                              <Box style={styles.box} marginRight='10px'>
                                 <TextField
                                    size='small'
                                    fullWidth
                                    required
                                    value={
                                       this.state.distributor_point_of_contacts[
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
                                          prevState.distributor_point_of_contacts[
                                             index
                                          ].name = prevState.poc_name;
                                          console.log(
                                             prevState
                                                .distributor_point_of_contacts[
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
                                       this.state.distributor_point_of_contacts[
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
                                          prevState.distributor_point_of_contacts[
                                             index
                                          ].designation =
                                             prevState.poc_designation;
                                          console.log(
                                             prevState
                                                .distributor_point_of_contacts[
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
                                       this.state.distributor_point_of_contacts[
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
                                          prevState.distributor_point_of_contacts[
                                             index
                                          ].mobile_no = prevState.poc_mobile_no;
                                          console.log(
                                             prevState
                                                .distributor_point_of_contacts[
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
                                       this.state.distributor_point_of_contacts[
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
                                          prevState.distributor_point_of_contacts[
                                             index
                                          ].sec_mobile_no =
                                             prevState.poc_sec_mobile_no;
                                          console.log(
                                             prevState
                                                .distributor_point_of_contacts[
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
                              {this.state.distributor_point_of_contacts
                                 .length ===
                              index + 1 ? (
                                 <AddBoxOutlinedIcon
                                    color='secondary'
                                    fontSize='medium'
                                    onClick={() => {
                                       this.setState({});
                                       this.setState((prevState) => {
                                          prevState.distributor_point_of_contacts.push(
                                             {
                                                name: '',
                                                designation: '',
                                                mobile_no: '',
                                                sec_mobile_no: '',
                                             }
                                          );
                                          console.log(
                                             prevState.distributor_point_of_contacts
                                          );
                                       });
                                    }}
                                 />
                              ) : (
                                 <DeleteOutlineIcon
                                    color='secondary'
                                    fontSize='medium'
                                    onClick={() => {
                                       this.setState({});
                                       this.setState((prevState) => {
                                          prevState.distributor_point_of_contacts.splice(
                                             index,
                                             1
                                          );
                                          console.log(
                                             prevState.distributor_point_of_contacts
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
                     onClick={this.onAddHandler}
                  >
                     Add
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
