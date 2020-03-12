import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   FormControl,
   InputLabel,
   Select,
   MenuItem
} from '@material-ui/core';
import { PaperBoard } from '../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../Components/styles/FormStyles';
import permissionCheck from '../../Components/Auth/permissionCheck';
import { Datepick } from '../../Components/Date/Datepick';

const styles = Styles;
export default class AddEmployee extends Component {
   constructor(props) {
      super();
      this.state = {
         employee_first_name: '',
         employee_middle_name: '',
         employee_last_name: '',
         employee_dob: null,
         employee_age: '',
         employee_gender: '',
         employee_mobile_no: '',
         employee_email: '',
         employee_father_or_spouse_name: '',
         employee_no_of_children: '',
         employee_address: '',
         employee_country: '',
         employee_state: '',
         employee_city: '',
         employee_postal_code: '',
         employee_id: '',
         employee_date_of_joinig: null,
         employee_designation: '',
         employee_salary: '',
         employee_work_location: '',
         employee_shift: '',
         employee_bank_account_no: '',
         employee_bank_name: '',
         employee_bank_branch: '',
         employee_bank_ifsc: '',
         errors: [],
         countries: [],
         states: [],
         cities: [],
         designations: [],
         work_locations: [],
         shifts: []
      };
      this.onAddHandler = () => {
         axios
            .post('/employees/add-employee', {
               employee_first_name: this.state.employee_first_name,
               employee_middle_name: this.state.employee_middle_name,
               employee_last_name: this.state.employee_last_name,
               employee_dob: this.state.employee_dob,
               employee_age: this.state.employee_age,
               employee_gender: this.state.employee_gender,
               employee_mobile_no: this.state.employee_mobile_no,
               employee_email: this.state.employee_email,
               employee_father_or_spouse_name: this.state
                  .employee_father_or_spouse_name,
               employee_no_of_children: this.state.employee_no_of_children,
               employee_address: this.state.employee_address,
               employee_country: this.state.employee_country,
               employee_state: this.state.employee_state,
               employee_city: this.state.employee_city,
               employee_postal_code: this.state.employee_postal_code,
               employee_id: this.state.employee_id,
               employee_date_of_joinig: this.state.employee_date_of_joinig,
               employee_designation: this.state.employee_designation,
               employee_salary: this.state.employee_salary,
               employee_work_location: this.state.employee_work_location,
               employee_shift: this.state.employee_shift,
               employee_bank_account_no: this.state.employee_bank_account_no,
               employee_bank_name: this.state.employee_bank_name,
               employee_bank_branch: this.state.employee_bank_branch,
               employee_bank_ifsc: this.state.employee_bank_ifsc
            })
            .then(res => {
               console.log(res);
               if (res.data.errors.length > 0) {
                  console.log(res.data.errors);
                  this.setState({
                     errors: [...res.data.errors]
                  });
               } else {
                  this.props.cancel();
               }
            })
            .catch(err => console.log(err));
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Employees')) {
         axios.get('/countries/countries').then(res => {
            this.setState({
               countries: [...res.data.Countries]
            });
         });
         axios.get('/designations/designations').then(res => {
            this.setState({
               designations: [...res.data.Designations]
            });
         });
         axios.get('/work-locations/work-locations').then(res => {
            this.setState({
               work_locations: [...res.data.WorkLocations]
            });
         });
         axios.get('/shifts/shifts').then(res => {
            this.setState({
               shifts: [...res.data.Shifts]
            });
         });
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Employee
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
            <PaperBoard>
               <Box
                  fontWeight='bold'
                  fontSize='1.2vw'
                  mb={1}
                  display='flex'
                  justifyContent='flex-start'
                  width='100%'
               >
                  Personel Details
               </Box>
               <Box style={Styles.box_field} flexDirection='row'>
                  <Box style={Styles.box} marginRight='10px'>
                     <TextField
                        size='small'
                        required
                        fullWidth
                        variant='outlined'
                        label='First Name'
                        value={this.state.employee_first_name}
                        onChange={event => {
                           this.setState({
                              employee_first_name: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={Styles.box} marginRight='10px'>
                     <TextField
                        size='small'
                        fullWidth
                        variant='outlined'
                        label='Middle Name'
                        value={this.state.employee_middle_name}
                        onChange={event => {
                           this.setState({
                              employee_middle_name: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={Styles.box}>
                     <TextField
                        size='small'
                        fullWidth
                        variant='outlined'
                        label='Last Name'
                        value={this.state.employee_last_name}
                        onChange={event => {
                           this.setState({
                              employee_last_name: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
               </Box>
               <Box style={Styles.box_field}>
                  <Datepick
                     id='1'
                     Name='Date Of Birth'
                     Req={true}
                     marginRight={'10px'}
                     minDate={new Date() - 1000 * 60 * 60 * 24 * 365.25 * 60}
                     maxDate={new Date() - 1000 * 60 * 60 * 24 * 365.25 * 18}
                     value={this.state.employee_dob}
                     setDate={date => {
                        this.setState({});
                        this.setState(preState => {
                           preState.employee_dob = date;
                           preState.employee_age = Math.floor(
                              (new Date() - preState.employee_dob) /
                                 (1000 * 60 * 60 * 24 * 365.25)
                           );
                        });
                     }}
                  />
                  <Box style={Styles.box} marginRight='10px'>
                     <TextField
                        size='small'
                        fullWidth
                        variant='outlined'
                        label='Age'
                        type='number'
                        disabled={true}
                        value={this.state.employee_age}
                     ></TextField>
                  </Box>
                  <Box style={styles.box}>
                     <FormControl
                        size='small'
                        required
                        variant='outlined'
                        fullWidth
                     >
                        <InputLabel
                           style={{
                              backgroundColor: 'white',
                              paddingLeft: '2px',
                              paddingRight: '2px'
                           }}
                        >
                           Select Gender
                        </InputLabel>
                        <Select
                           required
                           value={this.state.employee_gender}
                           onChange={event => {
                              console.log(event.target.value);
                              this.setState({
                                 employee_gender: event.target.value
                              });
                           }}
                        >
                           <MenuItem selected value='Male'>
                              Male
                           </MenuItem>
                           <MenuItem selected value='Female'>
                              Female
                           </MenuItem>
                           <MenuItem selected value='Transgender'>
                              Transgender
                           </MenuItem>
                        </Select>
                     </FormControl>
                  </Box>
               </Box>
               <Box style={Styles.box_field}>
                  <Box style={Styles.box} marginRight='10px'>
                     <TextField
                        size='small'
                        fullWidth
                        variant='outlined'
                        label='Mobile No'
                        value={this.state.employee_mobile_no}
                        onChange={event => {
                           this.setState({
                              employee_mobile_no: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={Styles.box} marginRight='10px'>
                     <TextField
                        size='small'
                        fullWidth
                        variant='outlined'
                        label='Email'
                        type='email'
                        value={this.state.employee_email}
                        onChange={event => {
                           this.setState({
                              employee_email: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={Styles.box}>
                     <TextField
                        size='small'
                        fullWidth
                        variant='outlined'
                        label='Father / Spouse Name'
                        type='email'
                        value={this.state.employee_father_or_spouse_name}
                        onChange={event => {
                           this.setState({
                              employee_father_or_spouse_name: event.target.value
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
                     value={this.state.employee_address}
                     variant='outlined'
                     label='Address'
                     type='text'
                     onChange={event => {
                        this.setState({
                           employee_address: event.target.value
                        });
                     }}
                  ></TextField>
               </Box>
               <Box style={styles.box_field} marginTop='10px'>
                  <Box style={styles.box} marginRight='10px'>
                     <FormControl
                        size='small'
                        required
                        variant='outlined'
                        fullWidth
                        display='flex'
                     >
                        <InputLabel
                           style={{
                              backgroundColor: 'white',
                              paddingLeft: '2px',
                              paddingRight: '2px'
                           }}
                        >
                           Select Country
                        </InputLabel>
                        <Select
                           required
                           //variant='outlined'
                           value={this.state.employee_country}
                           onChange={event => {
                              console.log(event.target.value);
                              this.setState({
                                 employee_country: event.target.value,
                                 cities: []
                              });
                              axios
                                 .post('/states/state-country', {
                                    country_id: event.target.value
                                 })
                                 .then(res => {
                                    console.log(res);
                                    this.setState({
                                       states: [...res.data.state]
                                    });
                                 });
                           }}
                        >
                           {this.state.countries.map((country, index) => {
                              return (
                                 <MenuItem
                                    selected
                                    key={index}
                                    value={country._id}
                                 >
                                    {country.country_name}
                                 </MenuItem>
                              );
                           })}
                        </Select>
                     </FormControl>
                  </Box>
                  <Box style={styles.box} marginRight='10px'>
                     <FormControl
                        size='small'
                        required
                        variant='outlined'
                        fullWidth
                     >
                        <InputLabel
                           style={{
                              backgroundColor: 'white',
                              paddingLeft: '2px',
                              paddingRight: '2px'
                           }}
                        >
                           Select State
                        </InputLabel>
                        <Select
                           required
                           //variant='outlined'
                           value={this.state.employee_state}
                           onChange={event => {
                              console.log(event.target.value);
                              this.setState({
                                 employee_state: event.target.value
                              });
                              axios
                                 .post('/cities/city-state', {
                                    state_id: event.target.value
                                 })
                                 .then(res => {
                                    console.log(res);
                                    this.setState({
                                       cities: [...res.data.city]
                                    });
                                 });
                           }}
                        >
                           {this.state.states.map((state, index) => {
                              return (
                                 <MenuItem
                                    selected
                                    key={index}
                                    value={state._id}
                                 >
                                    {state.state_name}
                                 </MenuItem>
                              );
                           })}
                        </Select>
                     </FormControl>
                  </Box>
                  <Box style={styles.box}>
                     <FormControl
                        size='small'
                        required
                        variant='outlined'
                        fullWidth
                     >
                        <InputLabel
                           style={{
                              backgroundColor: 'white',
                              paddingLeft: '2px',
                              paddingRight: '2px'
                           }}
                        >
                           Select City
                        </InputLabel>
                        <Select
                           required
                           //variant='outlined'
                           value={this.state.employee_city}
                           onChange={event => {
                              console.log(event.target.value);
                              this.setState({
                                 employee_city: event.target.value
                              });
                           }}
                        >
                           {this.state.cities.map((city, index) => {
                              return (
                                 <MenuItem
                                    selected
                                    key={index}
                                    value={city._id}
                                 >
                                    {city.city_name}
                                 </MenuItem>
                              );
                           })}
                        </Select>
                     </FormControl>
                  </Box>
               </Box>
               <Box style={styles.box_field}>
                  <TextField
                     size='small'
                     fullWidth
                     required
                     value={this.state.employee_postal_code}
                     variant='outlined'
                     label='Postal Code'
                     type='text'
                     onChange={event => {
                        this.setState({
                           employee_postal_code: event.target.value
                        });
                     }}
                  ></TextField>
               </Box>
               <Box
                  fontWeight='bold'
                  fontSize='1.2vw'
                  mb={1}
                  display='flex'
                  justifyContent='flex-start'
                  width='100%'
               >
                  Work Details
               </Box>
               <Box style={Styles.box_field}>
                  <Box style={Styles.box} marginRight='10px'>
                     <TextField
                        size='small'
                        fullWidth
                        variant='outlined'
                        label='Employee ID'
                        value={this.state.employee_id}
                        onChange={event => {
                           this.setState({
                              employee_id: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Datepick
                     id='2'
                     Name='Date Of Joining'
                     Req={true}
                     value={this.state.employee_date_of_joinig}
                     minDate='01/01/1990'
                     maxDate={new Date()}
                     setDate={date => {
                        this.setState({
                           employee_date_of_joinig: date
                        });
                     }}
                  />
               </Box>
               <Box style={Styles.box_field}>
                  <Box style={styles.box} marginRight='10px'>
                     <FormControl
                        size='small'
                        required
                        variant='outlined'
                        fullWidth
                     >
                        <InputLabel
                           style={{
                              backgroundColor: 'white',
                              paddingLeft: '2px',
                              paddingRight: '2px'
                           }}
                        >
                           Select Designation
                        </InputLabel>
                        <Select
                           required
                           value={this.state.employee_designation}
                           onChange={event => {
                              console.log(event.target.value);
                              this.setState({
                                 employee_designation: event.target.value
                              });
                           }}
                        >
                           {this.state.designations.map(
                              (designation, index) => {
                                 return (
                                    <MenuItem
                                       selected
                                       key={index}
                                       value={designation._id}
                                    >
                                       {designation.designation_name}
                                    </MenuItem>
                                 );
                              }
                           )}
                        </Select>
                     </FormControl>
                  </Box>
                  <TextField
                     size='small'
                     fullWidth
                     variant='outlined'
                     label='Salary'
                     type='number'
                     value={this.state.employee_salary}
                     onChange={event => {
                        this.setState({
                           employee_salary: event.target.value
                        });
                     }}
                  ></TextField>
               </Box>
               <Box style={Styles.box_field}>
                  <Box style={styles.box} marginRight='10px'>
                     <FormControl
                        size='small'
                        required
                        variant='outlined'
                        fullWidth
                     >
                        <InputLabel
                           style={{
                              backgroundColor: 'white',
                              paddingLeft: '2px',
                              paddingRight: '2px'
                           }}
                        >
                           Select Work Location
                        </InputLabel>
                        <Select
                           required
                           value={this.state.employee_work_location}
                           onChange={event => {
                              console.log(event.target.value);
                              this.setState({
                                 employee_work_location: event.target.value
                              });
                           }}
                        >
                           {this.state.work_locations.map(
                              (WorkLocation, index) => {
                                 return (
                                    <MenuItem
                                       selected
                                       key={index}
                                       value={WorkLocation._id}
                                    >
                                       {WorkLocation.work_location_name}
                                    </MenuItem>
                                 );
                              }
                           )}
                        </Select>
                     </FormControl>
                  </Box>
                  <Box style={styles.box}>
                     <FormControl
                        size='small'
                        required
                        variant='outlined'
                        fullWidth
                     >
                        <InputLabel
                           style={{
                              backgroundColor: 'white',
                              paddingLeft: '2px',
                              paddingRight: '2px'
                           }}
                        >
                           Select Shift
                        </InputLabel>
                        <Select
                           required
                           value={this.state.employee_shift}
                           onChange={event => {
                              console.log(event.target.value);
                              this.setState({
                                 employee_shift: event.target.value
                              });
                           }}
                        >
                           {this.state.shifts.map((Shift, index) => {
                              return (
                                 <MenuItem
                                    selected
                                    key={index}
                                    value={Shift._id}
                                 >
                                    {Shift.shift_name}
                                 </MenuItem>
                              );
                           })}
                        </Select>
                     </FormControl>
                  </Box>
               </Box>
               <Box style={Styles.box_field}>
                  <Box style={Styles.box} marginRight='10px'>
                     <TextField
                        size='small'
                        fullWidth
                        variant='outlined'
                        label='Bank Account Number'
                        value={this.state.employee_bank_account_no}
                        onChange={event => {
                           this.setState({
                              employee_bank_account_no: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={Styles.box}>
                     <TextField
                        size='small'
                        fullWidth
                        variant='outlined'
                        label='Bank Name'
                        value={this.state.employee_bank_name}
                        onChange={event => {
                           this.setState({
                              employee_bank_name: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
               </Box>
               <Box style={Styles.box_field}>
                  <Box style={Styles.box} marginRight='10px'>
                     <TextField
                        size='small'
                        fullWidth
                        variant='outlined'
                        label='Branch'
                        value={this.state.employee_bank_branch}
                        onChange={event => {
                           this.setState({
                              employee_bank_branch: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={Styles.box}>
                     <TextField
                        size='small'
                        fullWidth
                        variant='outlined'
                        label='IFSC'
                        value={this.state.employee_bank_ifsc}
                        onChange={event => {
                           this.setState({
                              employee_bank_ifsc: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
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
