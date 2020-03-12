import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';
import permissionCheck from '../../Components/Auth/permissionCheck';
import FilterEmployee from './FilterEmployee';

export default class ManageEmployees extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'ID', field: 'id' },
            { title: 'First Name', field: 'employee_first_name' },
            { title: 'Last Name', field: 'employee_last_name' },
            { title: 'ID', field: 'employee_id' },
            { title: 'shift', field: 'employee_shift_name' },
            { title: 'Designation', field: 'employee_designation_name' },
            {
               title: 'Work Location',
               field: 'employee_work_location_name'
            }
         ],
         data: [],
         filters: {
            firstName: '',
            lastName: '',
            fromDOB: null,
            toDOB: null,
            fromAge: '',
            toAge: '',
            gender: '',
            mobile: '',
            email: '',
            country: '',
            state: '',
            city: '',
            postalCode: '',
            employeeId: '',
            fromDateOfJoining: null,
            toDateOfJoining: null,
            designation: '',
            fromSalary: '',
            toSalary: '',
            workLocation: '',
            shift: ''
         },
         openAdd: false,
         openEdit: false,
         openFilter: false,
         shifts: [],
         workLocations: [],
         designations: []
      };
      this.OnEditHandler = (event, rowData) => {
         console.log(rowData._id);
         axios
            .post('/employees/employee', {
               _id: rowData._id
            })
            .then(res => {
               console.log(res);
               this.EditData = { ...res.data.Employee };
               console.log(this.EditData[0]);
               this.setState({
                  openEdit: true
               });
            });
      };

      this.dataFetch = () => {
         axios
            .get('/employees/employees')
            .then(res => {
               this.handleClose(res);
            })
            .catch(err => {});
      };

      this.handleClose = res => {
         for (let i = 0; i < res.data.Employees.length; i++) {
            res.data.Employees[i].id = i + 1;

            //Designations
            this.state.designations.find((designation, index) => {
               if (
                  designation._id === res.data.Employees[i].employee_designation
               ) {
                  //console.log('Hello');
                  res.data.Employees[i].employee_designation_name =
                     designation.designation_name;
               } else {
                  if (
                     index === this.state.designations.length - 1 &&
                     !res.data.Employees[i].employee_designation_name
                  ) {
                     res.data.Employees[i].employee_designation_name =
                        ' Problem Loading Data';
                  }
               }
               return null;
            });

            //WorkLocations
            this.state.workLocations.find((work_location, index) => {
               if (
                  work_location._id ===
                  res.data.Employees[i].employee_work_location
               ) {
                  // console.log('Hello');
                  res.data.Employees[i].employee_work_location_name =
                     work_location.work_location_name;
               } else {
                  if (
                     index === this.state.workLocations.length - 1 &&
                     !res.data.Employees[i].employee_work_location_name
                  ) {
                     res.data.Employees[i].employee_work_location_name =
                        ' Problem Loading Data';
                  }
               }
               return null;
            });

            //shifts
            this.state.shifts.find((shift, index) => {
               if (shift._id === res.data.Employees[i].employee_shift) {
                  res.data.Employees[i].employee_shift_name = shift.shift_name;
               } else {
                  if (
                     index === this.state.shifts.length - 1 &&
                     !res.data.Employees[i].employee_shift_name
                  ) {
                     res.data.Employees[i].employee_shift_name =
                        ' Problem Loading Data';
                  }
               }
               return null;
            });
         }
         this.setState({
            data: [...res.data.Employees]
         });
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Employees')) {
         if (
            this.state.shifts.length === 0 &&
            this.state.designations.length === 0 &&
            this.state.workLocations.length === 0
         ) {
            axios.get('/shifts/shifts').then(res => {
               this.setState({
                  shifts: res.data.Shifts
               });
               axios.get('/work-locations/work-locations').then(res => {
                  this.setState({
                     workLocations: res.data.WorkLocations
                  });
                  axios.get('/designations/designations').then(res => {
                     this.setState({
                        designations: res.data.Designations
                     });
                     this.dataFetch();
                  });
               });
            });
         }
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
               Manage Employees
            </Box>
            <Box width='90%' display='flex' flexDirection='row'>
               <Button
                  variant='contained'
                  color='primary'
                  style={{
                     marginBottom: '20px',
                     display: 'flex',
                     marginRight: '10px'
                  }}
                  size='large'
                  onClick={() => {
                     this.setState({
                        openAdd: true
                     });
                  }}
               >
                  Add
               </Button>
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
                        openFilter: true
                     });
                  }}
               >
                  Filters
               </Button>
            </Box>

            <MaterialTable
               title=' '
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
                     tooltip: 'Edit',
                     onClick: (event, rowData) => {
                        this.OnEditHandler(event, rowData);
                     }
                  }
               ]}
               editable={{
                  onRowDelete: oldData =>
                     axios
                        .post('/employees/delete-employee', {
                           _id: oldData._id
                        })
                        .then(res => {
                           console.log(res);
                           if (res) {
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
                  <AddEmployee
                     cancel={() => {
                        this.setState({
                           openAdd: false
                        });
                        this.dataFetch();
                     }}
                  />
               </DialogContent>
            </Dialog>
            <Dialog open={this.state.openEdit} maxWidth='lg' fullWidth>
               <DialogContent style={{ padding: '20px' }}>
                  <EditEmployee
                     Employee={this.EditData[0]}
                     cancel={() => {
                        this.setState({
                           openEdit: false
                        });
                        // this.dataFetch();
                     }}
                  />
               </DialogContent>
            </Dialog>
            <Dialog open={this.state.openFilter} maxWidth='lg' fullWidth>
               <DialogContent style={{ padding: '20px' }}>
                  <FilterEmployee
                     filters={this.state.filters}
                     setData={res => {
                        //console.log('Hello', res);
                        this.handleClose(res);
                     }}
                     cancel={() => {
                        this.setState({
                           openFilter: false
                        });
                     }}
                     saveFilters={filters => {
                        this.setState(prevState => {
                           prevState.filters = filters;
                        });

                        this.setState({
                           openFilter: false
                        });
                     }}
                  />
               </DialogContent>
            </Dialog>
         </Box>
      );
   }
}
