import React, { Component } from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';
import { Box, Button, DialogContent, Snackbar } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MUIAlert from '@material-ui/lab/Alert';
import permissionCheck from '../../Components/Auth/permissionCheck';
import AddRole from './AddRole';
import EditRole from './EditRole';

export default class ManageRole extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'ID', field: 'id' },
            { title: 'Role Name', field: 'role_name' },
            { title: 'Description', field: 'description' }
            // { title: 'Permissions', field: 'permissions' }
         ],
         data: [],
         open: false,
         openAdd: false,
         openEdit: false,
         msg: ''
      };
      this.onEditHandler = (event, rowData) => {
         axios
            .post('/roles/role', {
               _id: rowData._id
            })
            .then(role => {
               this.EditData = { ...role.data.Role[0] };
               console.log('Edit ', this.EditData);
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios
            .get('/roles/roles')
            .then(res => {
               console.log(res.data);
               //res.data.Roles = res.data.Roles.splice(1, res.data.Roles.length);
               for (let i = 0; i < res.data.Roles.length; i++) {
                  res.data.Roles[i].id = i + 1;
               }
               this.setState({
                  data: [...res.data.Roles]
               });
            })
            .catch(() => {});
      };
      this.openSnack = () => {
         this.setState({
            open: true
         });
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Roles')) {
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
               Manage Role
            </Box>
            <Box width='90%'>
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
                        openAdd: true
                     });
                  }}
               >
                  Add Role
               </Button>
            </Box>

            <MaterialTable
               title=''
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
                     tooltip: 'edit Role',
                     onClick: (event, rowData) => {
                        this.onEditHandler(event, rowData);
                     }
                  }
               ]}
               editable={{
                  onRowDelete: oldData =>
                     axios
                        .post('/roles/delete-role', {
                           role_name: oldData.role_name
                        })
                        .then(Role => {
                           console.log(Role);
                           if (Role) {
                              this.setState(prevState => {
                                 const data = [...prevState.data];
                                 data.splice(data.indexOf(oldData), 1);
                                 return { ...prevState, data };
                              });
                              this.setState({
                                 msg: 'Deleted'
                              });
                              this.openSnack();
                           }
                        })
               }}
               onRowClick={(event, rowData) => {
                  this.onEditHandler(event, rowData);
               }}
            />
            <Dialog open={this.state.openAdd} maxWidth='lg' fullWidth>
               <DialogContent style={{ padding: '20px' }}>
                  <AddRole
                     cancel={() => {
                        this.setState({
                           openAdd: false,
                           msg: 'Added'
                        });
                        this.handleClose();
                     }}
                     snack={() => {
                        this.openSnack();
                     }}
                  />
               </DialogContent>
            </Dialog>
            <Dialog open={this.state.openEdit} maxWidth='lg' fullWidth>
               <DialogContent style={{ padding: '20px' }}>
                  <EditRole
                     role={this.EditData}
                     cancel={() => {
                        this.setState({
                           openEdit: false,
                           msg: 'Updated'
                        });
                        this.handleClose();
                     }}
                     snack={() => {
                        this.openSnack();
                     }}
                  />
               </DialogContent>
            </Dialog>
            <Snackbar
               open={this.state.open}
               autoHideDuration={3000}
               onClose={() => {
                  this.setState({ open: false });
               }}
            >
               <MUIAlert
                  onClose={() => {
                     this.setState({ open: false });
                  }}
                  severity='success'
                  elevation={6}
                  variant='filled'
               >
                  Role {this.state.msg}!
               </MUIAlert>
            </Snackbar>
         </Box>
      );
   }
}
