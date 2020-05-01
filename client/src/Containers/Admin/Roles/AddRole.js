import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   Checkbox,
   FormControlLabel,
   LinearProgress,
} from '@material-ui/core';
import { PaperBoard } from '../../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../../Components/styles/FormStyles';
import Permissions from './Permissions';
import permissionCheck from '../../../Components/Auth/permissionCheck';

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
         finance: false,
         purchase: false,
         production: false,
         errors: [],
         success: false,
         dataReceived: false,
      };

      this.manageSelected = 0;
      this.requestSelected = 0;
      this.reportSelected = 0;
      this.configurationSelected = 0;
      this.purchaseSelected = 0;
      this.financeSelected = 0;
      this.productionSelected = 0;

      this.onAddHandler = () => {
         this.setState({
            dataReceived: false,
         });
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
         if (this.state.purchase) {
            givenPermissions.push({ name: 'Purchase', Value: true });
         }
         if (this.state.finance) {
            givenPermissions.push({ name: 'Finance', Value: true });
         }
         if (this.state.production) {
            givenPermissions.push({ name: 'Production', Value: true });
         }
         this.state.permissions.map((permission) => {
            if (permission.value === true) {
               givenPermissions.push(permission);
            }
            return null;
         });
         axios
            .post('/roles/add-role', {
               role_name: this.state.role_name,
               description: this.state.description,
               permissions: givenPermissions,
            })
            .then((res) => {
               console.log(res);
               if (res.data.errors.length > 0) {
                  console.log(res.data.errors);
                  this.setState({
                     errors: [...res.data.errors],
                     success: false,
                     dataReceived: true,
                  });
               } else {
                  this.setState({
                     dataReceived: true,
                  });
                  this.props.cancel();
                  this.props.snack();
               }
            })
            .catch((err) => console.log(err));
      };
      this.onCheckHandle = (component, value) => {
         switch (component) {
            case 'management': {
               if (value) {
                  this.manageSelected++;
               } else {
                  this.manageSelected--;
               }
               if (this.manageSelected > 0) {
                  this.setState({
                     management: true,
                  });
               } else {
                  this.setState({
                     management: false,
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
                     reports: true,
                  });
               } else {
                  this.setState({
                     reports: false,
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
                     requests: true,
                  });
               } else {
                  this.setState({
                     requests: false,
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
                     configurations: true,
                  });
               } else {
                  this.setState({
                     configurations: false,
                  });
               }
               break;
            }
            case 'purchase': {
               console.log(`purchase ${value}`);
               if (value) {
                  this.purchaseSelected++;
               } else {
                  this.purchaseSelected--;
               }
               if (this.purchaseSelected > 0) {
                  this.setState({
                     purchase: true,
                  });
               } else {
                  this.setState({
                     purchase: false,
                  });
               }
               break;
            }
            case 'finance': {
               console.log(`finance ${value}`);
               if (value) {
                  this.financeSelected++;
               } else {
                  this.financeSelected--;
               }
               if (this.financeSelected > 0) {
                  this.setState({
                     finance: true,
                  });
               } else {
                  this.setState({
                     finance: false,
                  });
               }
               break;
            }
            case 'production': {
               console.log(`production ${value}`);
               if (value) {
                  this.productionSelected++;
               } else {
                  this.productionSelected--;
               }
               if (this.productionSelected > 0) {
                  this.setState({
                     production: true,
                  });
               } else {
                  this.setState({
                     production: false,
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
         this.setState({
            dataReceived: true,
         });
      }
   }
   componentWillUnmount() {
      this.state.permissions.map((permission) => {
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
            <Box width='94%'>
               {!this.state.dataReceived ? <LinearProgress /> : null}
            </Box>
            <PaperBoard>
               <Box style={styles.box_field}>
                  <TextField
                     fullWidth
                     required
                     value={this.state.role_name}
                     variant='outlined'
                     label='Role Name'
                     type='text'
                     onChange={(event) => {
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
                     onChange={(event) => {
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
                              value={this.state.management}
                              onClick={() => {
                                 this.setState({});
                                 this.setState((prevState) => {
                                    prevState.management = !prevState.management;
                                    if (prevState.management === true) {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                   'management' &&
                                                permission.value === false
                                             ) {
                                                permission.value = true;
                                                this.manageSelected++;
                                             }
                                             return null;
                                          }
                                       );
                                    } else {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                'management'
                                             ) {
                                                permission.value = false;
                                             }
                                             return null;
                                          }
                                       );
                                    }
                                 });
                              }}
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
                              value={this.state.requests}
                              onClick={() => {
                                 this.setState({});
                                 this.setState((prevState) => {
                                    prevState.requests = !prevState.requests;
                                    if (prevState.requests === true) {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                   'requests' &&
                                                permission.value === false
                                             ) {
                                                permission.value = true;
                                                this.requestSelected++;
                                             }
                                             return null;
                                          }
                                       );
                                    } else {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                'requests'
                                             ) {
                                                permission.value = false;
                                             }
                                             return null;
                                          }
                                       );
                                    }
                                 });
                              }}
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
                              value={this.state.reports}
                              onClick={() => {
                                 this.setState({});
                                 this.setState((prevState) => {
                                    prevState.reports = !prevState.reports;
                                    if (prevState.reports === true) {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                   'reports' &&
                                                permission.value === false
                                             ) {
                                                permission.value = true;
                                                this.reportSelected++;
                                             }
                                             return null;
                                          }
                                       );
                                    } else {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                'reports'
                                             ) {
                                                permission.value = false;
                                             }
                                             return null;
                                          }
                                       );
                                    }
                                 });
                              }}
                           />
                        }
                        label='Reports'
                     />
                  </Box>
                  <Box width='20%' display='flex'>
                     <FormControlLabel
                        control={
                           <Checkbox
                              checked={this.state.purchase}
                              value={this.state.purchase}
                              onClick={() => {
                                 this.setState({});
                                 this.setState((prevState) => {
                                    prevState.purchase = !prevState.purchase;
                                    if (prevState.purchase === true) {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                   'purchase' &&
                                                permission.value === false
                                             ) {
                                                permission.value = true;
                                                this.purchaseSelected++;
                                             }
                                             return null;
                                          }
                                       );
                                    } else {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                'purchase'
                                             ) {
                                                permission.value = false;
                                             }
                                             return null;
                                          }
                                       );
                                    }
                                 });
                              }}
                           />
                        }
                        label='Purchase'
                     />
                  </Box>
                  <Box width='20%' display='flex'>
                     <FormControlLabel
                        control={
                           <Checkbox
                              checked={this.state.finance}
                              value={this.state.finance}
                              onClick={() => {
                                 this.setState({});
                                 this.setState((prevState) => {
                                    prevState.finance = !prevState.finance;
                                    if (prevState.finance === true) {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                   'finance' &&
                                                permission.value === false
                                             ) {
                                                permission.value = true;
                                                this.financeSelected++;
                                             }
                                             return null;
                                          }
                                       );
                                    } else {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                'finance'
                                             ) {
                                                permission.value = false;
                                             }
                                             return null;
                                          }
                                       );
                                    }
                                 });
                              }}
                           />
                        }
                        label='Finance'
                     />
                  </Box>
                  <Box width='20%' display='flex'>
                     <FormControlLabel
                        control={
                           <Checkbox
                              checked={this.state.production}
                              value={this.state.production}
                              onClick={() => {
                                 this.setState({});
                                 this.setState((prevState) => {
                                    prevState.production = !prevState.production;
                                    if (prevState.production === true) {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                   'production' &&
                                                permission.value === false
                                             ) {
                                                permission.value = true;
                                                this.productionSelected++;
                                             }
                                             return null;
                                          }
                                       );
                                    } else {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                'production'
                                             ) {
                                                permission.value = false;
                                             }
                                             return null;
                                          }
                                       );
                                    }
                                 });
                              }}
                           />
                        }
                        label='Production'
                     />
                  </Box>
                  <Box width='20%' display='flex'>
                     <FormControlLabel
                        control={
                           <Checkbox
                              checked={this.state.configurations}
                              value={this.state.configurations}
                              onClick={() => {
                                 this.setState({});
                                 this.setState((prevState) => {
                                    prevState.configurations = !prevState.configurations;
                                    if (prevState.configurations === true) {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                   'configurations' &&
                                                permission.value === false
                                             ) {
                                                permission.value = true;
                                                this.configurationSelected++;
                                             }
                                             return null;
                                          }
                                       );
                                    } else {
                                       prevState.permissions.map(
                                          (permission) => {
                                             if (
                                                permission.component ===
                                                'configurations'
                                             ) {
                                                permission.value = false;
                                             }
                                             return null;
                                          }
                                       );
                                    }
                                 });
                              }}
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
                                    onClick={(e) => {
                                       permission.value = !permission.value;
                                       console.log(permission.component);
                                       this.onCheckHandle(
                                          permission.component,
                                          permission.value
                                       );
                                       this.setState({
                                          permissions: [
                                             ...this.state.permissions,
                                          ],
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
