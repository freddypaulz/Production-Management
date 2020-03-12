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

export default class EditRole extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         role_name: '',
         description: '',
         permissions: Permissions,
         management: false,
         requests: false,
         reports: false,
         configurations: false,
         errors: [],
         success: false,
         open: false
      };

      this.manageSelected = 0;
      this.requestSelected = 0;
      this.reportSelected = 0;
      this.configurationSelected = 0;

      this.onEditHandler = () => {
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
            .post('/roles/edit-role', {
               _id: this.state._id,
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
                  this.state.permissions.map(permission => {
                     permission.value = false;
                     return null;
                  });
                  // this.setState({
                  //    role_name: '',
                  //    description: '',
                  //    permissions: [],
                  //    errors: [],
                  //    success: true,
                  //    open: true
                  // });
                  this.props.snack();
                  this.props.cancel();
               }
            })
            .catch(err => console.log(err));
      };

      this.onCheckHandle = (component, value) => {
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
         if (this.state.role_name === '') {
            this.setState({
               role_name: this.props.role.role_name,
               description: this.props.role.description,
               _id: this.props.role._id
            });
            this.state.permissions.map(permission => {
               this.props.role.permissions.map(rolePermission => {
                  if (permission.name === rolePermission.name) {
                     if (rolePermission.component === 'management') {
                        this.setState({
                           management: true
                        });
                        this.manageSelected++;
                     } else if (rolePermission.component === 'requests') {
                        this.setState({
                           requests: true
                        });
                        this.requestSelected++;
                     } else if (rolePermission.component === 'reports') {
                        this.setState({
                           reports: true
                        });
                        this.reportSelected++;
                     } else if (rolePermission.component === 'configurations') {
                        this.setState({
                           configurations: true
                        });
                        this.configurationSelected++;
                     }
                     permission.value = true;
                  }
                  return null;
               });
               return null;
            });
         }
      }
   }
   componentWillUnmount() {
      this.state.permissions.map(permission => {
         permission.value = false;
         return null;
      });
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Edit Role
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
                        label='Configuration'
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
                                       // permission.value = !permission.value;
                                       // this.setState({
                                       //    permissions: [
                                       //       ...this.state.permissions
                                       //    ]
                                       // });
                                       // console.log(this.state.permissions);
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
