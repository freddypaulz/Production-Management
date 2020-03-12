import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import permissionCheck from '../../Components/Auth/permissionCheck';
import AddUser from './AddUser';
import EditUser from './EditUser';

export default class ManageUser extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'ID', field: 'id' },
            { title: 'Employee ID', field: 'employee_id' },
            { title: 'Name', field: 'name' },
            { title: 'Role', field: 'role' }
         ],
         data: [],
         openAdd: false,
         openEdit: false,
         msg: ''
      };
      this.OnEditHandler = (event, rowData) => {
         axios
            .post('/users/user', {
               name: rowData.name
            })
            .then(user => {
               this.EditData = { ...user.data.Users[0] };
               console.log('Edit Data', this.EditData);
               this.setState({
                  openEdit: true
               });
            });
      };
      this.handleClose = () => {
         axios.get('/users/users').then(res => {
            console.log(res.data.Users);

            // res.data.Users = res.data.Users.splice(1, res.data.Users.length);
            console.log(res.data.Users);
            for (let i = 0; i < res.data.Users.length; i++) {
               res.data.Users[i].id = i + 1;
               axios
                  .post('/roles/role', {
                     _id: res.data.Users[i].role
                  })
                  .then(role => {
                     if (role.data.Role[0]) {
                        console.log('role: ', role.data.Role[0].role_name);
                        res.data.Users[i].role = role.data.Role[0].role_name;
                        this.setState({
                           data: [...res.data.Users]
                        });
                     } else {
                        res.data.Users[i].role = 'problem loading role';
                        this.setState({
                           data: [...res.data.Users]
                        });
                     }
                  });
               axios
                  .post('/employees/employee', {
                     _id: res.data.Users[i].employee_id
                  })
                  .then(employee => {
                     if (employee.data.Employee[0]) {
                        console.log(
                           'employee: ',
                           employee.data.Employee[0].employee_id
                        );
                        res.data.Users[i].employee_id =
                           employee.data.Employee[0].employee_id;
                        this.setState({
                           data: [...res.data.Users]
                        });
                     } else {
                        res.data.Users[i].employee_id =
                           'problem loading Employee ID';
                        this.setState({
                           data: [...res.data.Users]
                        });
                     }
                  });
            }
            this.setState({
               data: [...res.data.Users]
            });
         });
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Users')) {
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
               Manage User
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
                  Add Users
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
                     tooltip: 'Edit User',
                     onClick: (event, rowData) => {
                        this.OnEditHandler(event, rowData);
                     }
                  }
               ]}
               editable={{
                  onRowDelete: oldData =>
                     axios
                        .post('/users/delete-user', {
                           _id: oldData._id
                        })
                        .then(User => {
                           console.log(User);
                           if (User) {
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
                  <AddUser
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
                  <EditUser
                     user={this.EditData}
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
         </Box>
      );
   }
}
