import React, { useState, useEffect } from 'react';
import {
   Box,
   TextField,
   Button,
   FormControl,
   InputLabel,
   Select,
   MenuItem
} from '@material-ui/core';
import axios from 'axios';
import { PaperBoard } from '../../Components/PaperBoard/PaperBoard';
import { Datepick } from '../../Components/Date/Datepick';
import styles from '../../Components/styles/FormStyles';

export default function FilterEmployee(props) {
   const [firstName, setFirstName] = useState(props.filters.firstName);
   const [lastName, setLastName] = useState(props.filters.lastName);
   const [fromDOB, setFromDOB] = useState(props.filters.fromDOB);
   const [toDOB, setToDOB] = useState(props.filters.toDOB);
   const [fromAge, setFromAge] = useState(props.filters.fromAge);
   const [toAge, setToAge] = useState(props.filters.toAge);
   const [gender, setGender] = useState(props.filters.gender);
   const [mobile, setMobile] = useState(props.filters.mobile);
   const [email, setEmail] = useState(props.filters.email);
   const [country, setCountry] = useState(props.filters.country);
   const [countries, setCountries] = useState([]);
   const [state, setState] = useState(props.filters.state);
   const [states, setStates] = useState([]);
   const [city, setCity] = useState(props.filters.city);
   const [cities, setCities] = useState([]);
   const [postalCode, setPostalCode] = useState(props.filters.postalCode);
   const [employeeId, setEmployeeId] = useState(props.filters.employeeId);
   const [fromDateOfJoining, setFromDateOfJoining] = useState(
      props.filters.fromDateOfJoining
   );
   const [toDateOfJoining, setToDateOfJoining] = useState(
      props.filters.toDateOfJoining
   );
   const [designation, setDesignation] = useState(props.filters.designation);
   const [designations, setDesignations] = useState([]);
   const [fromSalary, setFromSalary] = useState(props.filters.fromSalary);
   const [toSalary, setToSalary] = useState(props.filters.toSalary);
   const [workLocation, setWorkLocation] = useState(props.filters.workLocation);
   const [workLocations, setWorkLocations] = useState([]);
   const [shift, setShift] = useState(props.filters.shift);
   const [shifts, setShifts] = useState([]);

   useEffect(() => {
      axios.get('/countries/countries').then(res => {
         setCountries([...res.data.Countries]);
         setCountry(props.filters.country);
         axios
            .post('/states/state-country', {
               country_id: props.filters.country
            })
            .then(state => {
               setStates([...state.data.state]);
               setState(props.filters.state);
               axios
                  .post('/cities/city-state', {
                     state_id: props.filters.state
                  })
                  .then(city => {
                     setCities([...city.data.city]);
                     setCity(props.filters.city);
                  });
            });
      });
   }, [props.filters.country, props.filters.state, props.filters.city]);

   useEffect(() => {
      axios.get('/designations/designations').then(res => {
         setDesignations(res.data.Designations);
         //console.log(res.data.Designations);
      });
   }, []);

   useEffect(() => {
      axios.get('/work-locations/work-locations').then(res => {
         setWorkLocations(res.data.WorkLocations);
         //console.log(res.data.WorkLocations);
      });
   }, []);

   useEffect(() => {
      axios.get('/shifts/shifts').then(res => {
         setShifts(res.data.Shifts);
         //console.log(res.data.Shifts);
      });
   }, []);

   return (
      <Box style={styles.box} alignContent='center'>
         <PaperBoard>
            <Box style={styles.box_field}>
               <Box style={styles.box} marginRight='10px'>
                  <TextField
                     size='small'
                     required
                     fullWidth
                     variant='outlined'
                     label='First Name'
                     value={firstName}
                     onChange={event => {
                        setFirstName(event.target.value);
                     }}
                  />
               </Box>
               <Box style={styles.box}>
                  <TextField
                     size='small'
                     required
                     fullWidth
                     variant='outlined'
                     label='Last Name'
                     value={lastName}
                     onChange={event => {
                        setLastName(event.target.value);
                     }}
                  />
               </Box>
            </Box>
            <Box style={styles.box_field}>
               <Box style={styles.box} marginRight='10px'>
                  <Datepick
                     id='1'
                     Name='From Date of Birth'
                     value={fromDOB}
                     setDate={date => {
                        date = date.startOf('day');
                        setFromDOB(date);
                     }}
                  />
               </Box>
               <Box style={styles.box}>
                  <Datepick
                     disabled={fromDOB !== null ? false : true}
                     id='2'
                     Name='To Date of Birth'
                     minDate={fromDOB}
                     value={toDOB}
                     setDate={date => {
                        date = date.endOf('day');
                        setToDOB(date);
                     }}
                  />
               </Box>
            </Box>
            <Box style={styles.box_field}>
               <Box style={styles.box} marginRight='10px'>
                  <TextField
                     size='small'
                     required
                     fullWidth
                     variant='outlined'
                     label='From Age'
                     value={fromAge}
                     onChange={event => {
                        setFromAge(event.target.value);
                     }}
                  />
               </Box>
               <Box style={styles.box}>
                  <TextField
                     size='small'
                     required
                     fullWidth
                     variant='outlined'
                     label='To Age'
                     value={toAge}
                     onChange={event => {
                        setToAge(event.target.value);
                     }}
                  />
               </Box>
            </Box>
            <Box style={styles.box_field}>
               <FormControl size='small' required variant='outlined' fullWidth>
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
                     value={gender}
                     onChange={event => {
                        setGender(event.target.value);
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
            <Box style={styles.box_field}>
               <TextField
                  size='small'
                  required
                  fullWidth
                  variant='outlined'
                  label='Mobile No'
                  value={mobile}
                  onChange={event => {
                     setMobile(event.target.value);
                  }}
               />
            </Box>
            <Box style={styles.box_field}>
               <TextField
                  size='small'
                  required
                  fullWidth
                  variant='outlined'
                  label='Email'
                  value={email}
                  onChange={event => {
                     setEmail(event.target.value);
                  }}
               />
            </Box>
            <Box style={styles.box_field}>
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
                        value={country}
                        onChange={event => {
                           setCountry(event.target.value);
                           axios
                              .post('/states/state-country', {
                                 country_id: event.target.value
                              })
                              .then(res => {
                                 //console.log(res);
                                 setStates([...res.data.state]);
                              });
                        }}
                     >
                        {countries.map((country, index) => {
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
                     display='flex'
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
                        value={state}
                        onChange={event => {
                           setState(event.target.value);
                           axios
                              .post('/cities/city-state', {
                                 state_id: event.target.value
                              })
                              .then(res => {
                                 //console.log(res);
                                 setCities([...res.data.city]);
                              });
                        }}
                     >
                        {states.map((state, index) => {
                           return (
                              <MenuItem selected key={index} value={state._id}>
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
                     display='flex'
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
                        value={city}
                        onChange={event => {
                           setCity(event.target.value);
                        }}
                     >
                        {cities.map((city, index) => {
                           return (
                              <MenuItem selected key={index} value={city._id}>
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
                  required
                  fullWidth
                  variant='outlined'
                  label='Postal Code'
                  value={postalCode}
                  onChange={event => {
                     setPostalCode(event.target.value);
                  }}
               />
            </Box>
            <Box style={styles.box_field}>
               <TextField
                  size='small'
                  required
                  fullWidth
                  variant='outlined'
                  label='Employee Id'
                  value={employeeId}
                  onChange={event => {
                     setEmployeeId(event.target.value);
                  }}
               />
            </Box>
            <Box style={styles.box_field}>
               <Box style={styles.box} marginRight='10px'>
                  <Datepick
                     id='3'
                     Name='From Date of Joining'
                     value={fromDateOfJoining}
                     setDate={date => {
                        date = date.startOf('day');
                        setFromDateOfJoining(date);
                     }}
                  />
               </Box>
               <Box style={styles.box}>
                  <Datepick
                     disabled={fromDateOfJoining !== null ? false : true}
                     id='4'
                     Name='To Date of Joining'
                     minDate={fromDateOfJoining}
                     value={toDateOfJoining}
                     setDate={date => {
                        date = date.endOf('day');
                        setToDateOfJoining(date);
                     }}
                  />
               </Box>
            </Box>
            <Box style={styles.box_field}>
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
                     Select Designation
                  </InputLabel>
                  <Select
                     required
                     value={designation}
                     onChange={event => {
                        setDesignation(event.target.value);
                     }}
                  >
                     {designations.map((designation, index) => {
                        return (
                           <MenuItem
                              selected
                              key={index}
                              value={designation._id}
                           >
                              {designation.designation_name}
                           </MenuItem>
                        );
                     })}
                  </Select>
               </FormControl>
            </Box>
            <Box style={styles.box_field}>
               <Box style={styles.box} marginRight='10px'>
                  <TextField
                     size='small'
                     required
                     fullWidth
                     variant='outlined'
                     label='From Salary'
                     value={fromSalary}
                     onChange={event => {
                        setFromSalary(event.target.value);
                     }}
                  />
               </Box>
               <Box style={styles.box}>
                  <TextField
                     size='small'
                     required
                     fullWidth
                     variant='outlined'
                     label='To Salary'
                     value={toSalary}
                     onChange={event => {
                        setToSalary(event.target.value);
                     }}
                  />
               </Box>
            </Box>
            <Box style={styles.box_field}>
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
                     Select Work Location
                  </InputLabel>
                  <Select
                     required
                     value={workLocation}
                     onChange={event => {
                        setWorkLocation(event.target.value);
                     }}
                  >
                     {workLocations.map((workLocation, index) => {
                        return (
                           <MenuItem
                              selected
                              key={index}
                              value={workLocation._id}
                           >
                              {workLocation.work_location_name}
                           </MenuItem>
                        );
                     })}
                  </Select>
               </FormControl>
            </Box>
            <Box style={styles.box_field}>
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
                     Select Shifts
                  </InputLabel>
                  <Select
                     required
                     value={shift}
                     onChange={event => {
                        setShift(event.target.value);
                     }}
                  >
                     {shifts.map((shift, index) => {
                        return (
                           <MenuItem selected key={index} value={shift._id}>
                              {shift.shift_name}
                           </MenuItem>
                        );
                     })}
                  </Select>
               </FormControl>
            </Box>
         </PaperBoard>
         <Box
            display=' flex'
            marginTop='20px'
            justifyContent='flex-end'
            width='94%'
         >
            <Box width='100px'>
               <Button
                  variant='contained'
                  color='primary'
                  style={{
                     marginBottom: '20px',
                     display: 'flex'
                  }}
                  size='large'
                  onClick={() => {
                     let filters = {};

                     filters.firstName = '';
                     filters.lastName = '';
                     filters.fromDOB = null;
                     filters.toDOB = null;
                     filters.fromAge = '';
                     filters.toAge = '';
                     filters.gender = '';
                     filters.mobile = '';
                     filters.email = '';
                     filters.country = '';
                     filters.state = '';
                     filters.city = '';
                     filters.postalCode = '';
                     filters.employeeId = '';
                     filters.fromDateOfJoining = null;
                     filters.toDateOfJoining = null;
                     filters.designation = '';
                     filters.fromSalary = '';
                     filters.toSalary = '';
                     filters.designation = '';
                     filters.workLocation = '';
                     filters.shift = '';

                     setFirstName('');
                     setLastName('');
                     setFromDOB(null);
                     setToDOB(null);
                     setToAge('');
                     setGender('');
                     setMobile('');
                     setEmail('');
                     setCountry('');
                     setState('');
                     setStates([]);
                     setCity('');
                     setCities([]);
                     setPostalCode('');
                     setEmployeeId('');
                     setFromDateOfJoining(null);
                     setToDateOfJoining(null);
                     setDesignation('');
                     setFromSalary('');
                     setToSalary('');
                     setDesignation('');
                     setWorkLocation('');
                     setShift('');
                  }}
               >
                  clear
               </Button>
            </Box>
            <Box marginRight='10px' width='100px'>
               <Button
                  variant='contained'
                  color='primary'
                  style={{
                     marginBottom: '20px',
                     display: 'flex'
                  }}
                  size='large'
                  onClick={() => {
                     props.cancel();
                  }}
               >
                  Cancel
               </Button>
            </Box>
            <Box marginRight='10px' width='100px'>
               <Button
                  variant='contained'
                  color='primary'
                  style={{
                     marginBottom: '20px',
                     display: 'flex'
                  }}
                  size='large'
                  onClick={() => {
                     let filters = {};

                     filters.firstName = firstName;
                     filters.lastName = lastName;
                     filters.fromDOB = fromDOB;
                     filters.toDOB = toDOB;
                     filters.fromAge = fromAge;
                     filters.toAge = toAge;
                     filters.gender = gender;
                     filters.mobile = mobile;
                     filters.email = email;
                     filters.country = country;
                     filters.state = state;
                     filters.city = city;
                     filters.postalCode = postalCode;
                     filters.employeeId = employeeId;
                     filters.fromDateOfJoining = fromDateOfJoining;
                     filters.toDateOfJoining = toDateOfJoining;
                     filters.designation = designation;
                     filters.fromSalary = fromSalary;
                     filters.toSalary = toSalary;
                     filters.designation = designation;
                     filters.workLocation = workLocation;
                     filters.shift = shift;

                     axios
                        .post('/employees/filter', {
                           firstName,
                           lastName,
                           fromDOB,
                           toDOB,
                           fromAge,
                           toAge,
                           gender,
                           mobile,
                           email,
                           country,
                           state,
                           city,
                           postalCode,
                           employeeId,
                           fromDateOfJoining,
                           toDateOfJoining,
                           designation,
                           fromSalary,
                           toSalary,
                           workLocation,
                           shift
                        })
                        .then(res => {
                           props.setData(res);
                           props.saveFilters(filters);
                        });
                  }}
               >
                  Apply
               </Button>
            </Box>
         </Box>
      </Box>
   );
}
