import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   Select,
   MenuItem,
   FormControl,
   InputLabel
} from '@material-ui/core';
import { PaperBoard } from '../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../Components/styles/FormStyles';
import permissionCheck from '../../Components/Auth/permissionCheck';
const styles = Styles;
let display = '';

export default class EditUser extends Component {
   constructor(props) {
      super();
      this.state = {
         employee_id: '',
         user_name: '',
         password: '',
         password2: '',
         errors: [],
         success: false,
         role: '',
         Roles: [],
         Employees: []
      };
      this.onEditHandler = () => {
         axios
            .post('/users/edit-user', {
               name: this.state.user_name,
               password: this.state.password,
               password2: this.state.password2,
               role: this.state.role
            })
            .then(res => {
               console.log(res);
               if (res.data.errors) {
                  if (res.data.errors.length > 0) {
                     console.log(res.data.errors);
                     this.setState({
                        errors: [...res.data.errors],
                        success: false
                     });
                  }
               } else {
                  this.props.cancel();
               }
            })
            .catch(err => console.log(err));
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Users')) {
         axios.get('/roles/roles').then(res => {
            //if (this.state.user_name === '' || this.state.role === '') {

            //}
            this.setState({ Roles: res.data.Roles });
         });
         axios.get('/employees/employees').then(res => {
            console.log(res.data.Employees);
            this.setState({ Employees: [...res.data.Employees] });
            this.setState({
               employee_id: this.props.user.employee_id,
               user_name: this.props.user.name,
               role: this.props.user.role
            });
         });
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Edit User
            </Box>
            {this.state.errors.length > 0 ? (
               this.state.errors.map((error, index) => {
                  return (
                     <Box style={styles.box_msg} bgcolor='#f73067' key={index}>
                        {error}
                     </Box>
                  );
               })
            ) : this.state.success === true ? (
               <Box bgcolor='#3df45b' style={styles.box_msg}>
                  Registration Successful
               </Box>
            ) : (
               <Box></Box>
            )}
            <PaperBoard>
               <Box style={styles.box_field}>
                  <FormControl disabled required variant='outlined' fullWidth>
                     <InputLabel
                        style={{
                           backgroundColor: 'white',
                           paddingLeft: '2px',
                           paddingRight: '2px'
                        }}
                     >
                        Select Employee
                     </InputLabel>
                     <Select
                        required
                        //variant='outlined'
                        value={this.state.employee_id}
                        onChange={event => {
                           console.log(event.target.value);
                           this.setState({
                              employee_id: event.target.value
                           });
                        }}
                     >
                        {this.state.Employees.map((Employee, index) => {
                           return (
                              <MenuItem
                                 selected
                                 key={index}
                                 value={Employee._id}
                              >
                                 {Employee.employee_first_name}
                              </MenuItem>
                           );
                        })}
                     </Select>
                  </FormControl>
               </Box>
               <Box style={styles.box_field}>
                  <TextField
                     disabled
                     fullWidth
                     required
                     value={this.state.user_name}
                     variant='outlined'
                     label='User Name'
                     type='text'
                     onChange={event => {
                        this.setState({ user_name: event.target.value });
                     }}
                  ></TextField>
               </Box>
               <Box style={{ width: '100%' }}>
                  <Box style={styles.box_field}>
                     <TextField
                        fullWidth
                        required
                        value={this.state.password}
                        variant='outlined'
                        label='Password'
                        type='password'
                        onChange={event => {
                           this.setState({ password: event.target.value });
                        }}
                     />
                  </Box>

                  <Box style={styles.box_field}>
                     <TextField
                        fullWidth
                        required
                        value={this.state.password2}
                        variant='outlined'
                        label='Confirm Password'
                        type='password'
                        onChange={event => {
                           this.setState({ password2: event.target.value });
                        }}
                     ></TextField>
                  </Box>
               </Box>

               <Box style={styles.box_field}>
                  <FormControl variant='outlined' fullWidth>
                     <InputLabel
                        style={{
                           backgroundColor: 'white',
                           paddingLeft: '2px',
                           paddingRight: '2px'
                        }}
                     >
                        Select Role
                     </InputLabel>
                     <Select
                        required
                        value={this.state.role}
                        onChange={event => {
                           console.log(event.target.value);
                           this.setState({
                              role: event.target.value
                           });
                        }}
                     >
                        {this.state.Roles.map((Role, index) => {
                           return (
                              <MenuItem selected key={index} value={Role._id}>
                                 {Role.role_name}
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
               width='97%'
            >
               <Box
                  marginRight='10px'
                  width='100px'
                  style={{ display: 'flex' }}
               >
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
               <Box width='100px' style={{ display: display }}>
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
