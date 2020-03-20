import React, { Component } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { PaperBoard } from '../../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../../Components/styles/FormStyles';
import errorCheck from './DepartmentValidation';
import permissionCheck from '../../../Components/Auth/permissionCheck';

const styles = Styles;
export default class AddDepartment extends Component {
   constructor(props) {
      super();
      this.state = {
         department_name: '',
         description: '',
         errors: [],
         status: 'Add',
         fieldError: {
            department_name: { status: false, msg: '' },
            description: { status: false, msg: '' }
         },
         isValid: false
      };
      this.onAddHandler = () => {
         this.setState({});
         if (this.state.department_name === '') {
            this.setState(prevState => {
               prevState.fieldError.department_name.status = true;
               prevState.fieldError.department_name.msg = 'Name required';
            });
         } else {
            axios
               .post('/departments/add-department', {
                  department_name: this.state.department_name,
                  description: this.state.description
               })
               .then(res => {
                  this.setState({
                     status: 'Add'
                  });
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
         }
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Departments')) {
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Department
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
               <Box style={styles.box_field}>
                  <TextField
                     name='department_name'
                     fullWidth
                     required
                     value={this.state.department_name}
                     variant='outlined'
                     label='Department Name'
                     type='text'
                     onChange={event => {
                        this.setState({
                           department_name: event.target.value
                        });
                        const { status, msg, isValid } = errorCheck(event);
                        this.setState(prevState => {
                           prevState.fieldError.department_name.status = status;
                           prevState.fieldError.department_name.msg = msg;
                           prevState.isValid = isValid;
                        });
                     }}
                     error={this.state.fieldError.department_name.status}
                     helperText={this.state.fieldError.department_name.msg}
                  />
               </Box>

               <Box style={styles.box_field}>
                  <TextField
                     name='description'
                     fullWidth
                     required
                     value={this.state.description}
                     variant='outlined'
                     label='Description'
                     type='text'
                     onChange={event => {
                        this.setState({ description: event.target.value });
                        const { status, msg, isValid } = errorCheck(event);
                        this.setState(prevState => {
                           prevState.fieldError.description.status = status;
                           prevState.fieldError.description.msg = msg;
                           prevState.isValid = isValid;
                        });
                     }}
                     error={this.state.fieldError.description.status}
                     helperText={this.state.fieldError.description.msg}
                  />
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
                     disabled={!this.state.isValid}
                     onClick={this.onAddHandler}
                  >
                     {this.state.status}
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
