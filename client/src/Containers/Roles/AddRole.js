import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   Checkbox,
   FormControlLabel
} from '@material-ui/core';
import { PaperBoard } from '../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../Components/styles/FormStyles';
import Permissions from './Permissions';
import permissionCheck from '../../Components/Auth/permissionCheck';

const styles = Styles;

export default class AddUser extends Component {
   constructor(props) {
      super();
      this.state = {
         role_name: '',
         description: '',
         permissions: Permissions,
         management: false,
         requests: false,
         reports: false,
         configurations: false,
         errors: [],
         success: false
      };

      this.manageSelected = 0;
      this.requestSelected = 0;
      this.reportSelected = 0;
      this.configurationSelected = 0;

      this.onAddHandler = () => {
         let givenPermissions = [];
         if (this.state.management) {
            givenPermissions.push({ name: 'Management', Value: true });
         }
         if (this.state.reports) {
            givenPermissions.push({ name: 'Reports', Value: true });
         }
         if (this.state.requests) {
            givenPermissions.push({ name: 'Requests', Value: true });
         }
         if (this.state.configurations) {
            givenPermissions.push({ name: 'Configurations', Value: true });
         }
         this.state.permissions.map(permission => {
            if (permission.value === true) {
               givenPermissions.push(permission);
            }
            return null;
         });
         axios
            .post('/roles/add-role', {
               role_name: this.state.role_name,
               description: this.state.description,
               permissions: givenPermissions
            })
            .then(res => {
               console.log(res);
               if (res.data.errors.length > 0) {
                  console.log(res.data.errors);
                  this.setState({
                     errors: [...res.data.errors],
                     success: false
                  });
               } else {
                  // this.setState({
                  //    role_name: '',
                  //    description: '',
                  //    permissions: [],
                  //    errors: [],
                  //    success: true
                  // });
                  this.props.cancel();
                  this.props.snack();
               }
            })
            .catch(err => console.log(err));
      };
      this.onCheckHandle = (component, value) => {
         //console.log(component);
         //console.log(`${component} ${value}`);
         switch (component) {
            case 'management': {
               console.log(`management ${value}`);
               if (value) {
                  this.manageSelected++;
               } else {
                  this.manageSelected--;
               }
               if (this.manageSelected > 0) {
                  this.setState({
                     management: true
                  });
               } else {
                  this.setState({
                     management: false
                  });
               }

               break;
            }
            case 'reports': {
               console.log(`reports ${value}`);
               if (value) {
                  this.reportSelected++;
               } else {
                  this.reportSelected--;
               }
               if (this.reportSelected > 0) {
                  this.setState({
                     reports: true
                  });
               } else {
                  this.setState({
                     reports: false
                  });
               }
               break;
            }
            case 'requests': {
               console.log(`requests ${value}`);
               if (value) {
                  this.requestSelected++;
               } else {
                  this.requestSelected--;
               }
               if (this.requestSelected > 0) {
                  this.setState({
                     requests: true
                  });
               } else {
                  this.setState({
                     requests: false
                  });
               }
               break;
            }
            case 'configurations': {
               console.log(`configurations ${value}`);
               if (value) {
                  this.configurationSelected++;
               } else {
                  this.configurationSelected--;
               }
               if (this.configurationSelected > 0) {
                  this.setState({
                     configurations: true
                  });
               } else {
                  this.setState({
                     configurations: false
                  });
               }
               break;
            }
            default: {
               break;
            }
         }
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Roles')) {
      }
   }
   componentWillUnmount() {
      this.state.permissions.map(permission => {
         if (permission.value === true) {
            permission.value = false;
         }
         return null;
      });
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Role
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
                  <TextField
                     fullWidth
                     required
                     value={this.state.role_name}
                     variant='outlined'
                     label='Role Name'
                     type='text'
                     onChange={event => {
                        this.setState({ role_name: event.target.value });
                     }}
                  ></TextField>
               </Box>
               <Box style={styles.box_field}>
                  <TextField
                     fullWidth
                     multiline
                     value={this.state.description}
                     variant='outlined'
                     label='Description'
                     type='text'
                     onChange={event => {
                        this.setState({ description: event.target.value });
                     }}
                  ></TextField>
               </Box>
               <Box
                  fontWeight='bold'
                  fontSize='20px'
                  mb={1}
                  display='flex'
                  justifyContent='flex-start'
                  width='100%'
               >
                  Permissions*
               </Box>
               <Box
                  display='flex'
                  flexWrap='wrap'
                  maxHeight='200px'
                  overflow='auto'
                  border='2px solid #dbdbdb'
                  padding='5px'
               >
                  <Box width='20%' display='flex'>
                     <FormControlLabel
                        control={
                           <Checkbox
                              checked={this.state.management}
                              disabled
                              value={this.state.management}
                           />
                        }
                        label='Management'
                     />
                  </Box>
                  <Box width='20%' display='flex'>
                     <FormControlLabel
                        control={
                           <Checkbox
                              checked={this.state.requests}
                              disabled
                              value={this.state.requests}
                           />
                        }
                        label='Requests'
                     />
                  </Box>
                  <Box width='20%' display='flex'>
                     <FormControlLabel
                        control={
                           <Checkbox
                              checked={this.state.reports}
                              disabled
                              value={this.state.reports}
                           />
                        }
                        label='Reports'
                     />
                  </Box>
                  <Box width='20%' display='flex'>
                     <FormControlLabel
                        control={
                           <Checkbox
                              checked={this.state.configurations}
                              disabled
                              value={this.state.configurations}
                           />
                        }
                        label='Configurations'
                     />
                  </Box>
                  {this.state.permissions.map((permission, index) => {
                     return (
                        <Box width='20%' display='flex' key={index}>
                           <FormControlLabel
                              control={
                                 <Checkbox
                                    checked={permission.value}
                                    onClick={e => {
                                       permission.value = !permission.value;
                                       console.log(permission.component);
                                       this.onCheckHandle(
                                          permission.component,
                                          permission.value
                                       );
                                       this.setState({
                                          permissions: [
                                             ...this.state.permissions
                                          ]
                                       });
                                    }}
                                    value={`${permission.name}`}
                                 />
                              }
                              label={`${permission.name}`}
                           />
                        </Box>
                     );
                  })}
               </Box>
            </PaperBoard>

            <Box
               display=' flex'
               marginTop='20px'
               justifyContent='flex-end'
               width='90%'
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
