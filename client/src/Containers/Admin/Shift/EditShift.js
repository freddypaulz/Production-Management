import React, { Component } from 'react';
import { Box, TextField, Button, LinearProgress } from '@material-ui/core';
import { PaperBoard } from '../../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../../Components/styles/FormStyles';
import errorCheck from './ShiftValidation';
import permissionCheck from '../../../Components/Auth/permissionCheck';

const styles = Styles;
export default class EditShift extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         shift_name: '',
         description: '',
         errors: [],
         success: false,
         fieldError: {
            shift_name: { status: false, msg: '' },
            description: { status: false, msg: '' },
         },
         isValid: false,
         dataReceived: false,
      };
      this.onEditHandler = () => {
         this.setState({});
         if (this.state.shift_name === '') {
            this.setState((prevState) => {
               prevState.fieldError.shift_name.status = true;
               prevState.fieldError.shift_name.msg = 'Name required';
            });
         } else {
            this.setState({
               dataReceived: false,
            });
            axios
               .post('/shifts/edit-shift', {
                  _id: this.state._id,
                  shift_name: this.state.shift_name,
                  description: this.state.description,
               })
               .then((res) => {
                  console.log(res);
                  if (res.data.errors) {
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
                     }
                  }
               })
               .catch((err) => console.log(err));
         }
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Shifts')) {
         this.setState({
            dataReceived: false,
         });
         if (this.state.shift_name === '') {
            this.setState({
               shift_name: this.props.shift.shift_name,
               description: this.props.shift.description,
               _id: this.props.shift._id,
               dataReceived: true,
            });
         }
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Edit Shift
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
            ) : null}
            <Box width='94%'>
               {!this.state.dataReceived ? <LinearProgress /> : null}
            </Box>
            <PaperBoard>
               <Box style={styles.box_field}>
                  <TextField
                     name='shift_name'
                     size='small'
                     fullWidth
                     required
                     value={this.state.shift_name}
                     variant='outlined'
                     label='Shift Name'
                     type='text'
                     onChange={(event) => {
                        this.setState({ shift_name: event.target.value });
                        const { status, msg, isValid } = errorCheck(event);
                        this.setState((prevState) => {
                           prevState.fieldError.shift_name.status = status;
                           prevState.fieldError.shift_name.msg = msg;
                           prevState.isValid = isValid;
                        });
                     }}
                     error={this.state.fieldError.shift_name.status}
                     helperText={this.state.fieldError.shift_name.msg}
                  />
               </Box>

               <Box style={styles.box_field}>
                  <TextField
                     name='description'
                     size='small'
                     fullWidth
                     multiline
                     value={this.state.description}
                     variant='outlined'
                     label='Description'
                     type='text'
                     onChange={(event) => {
                        this.setState({ description: event.target.value });
                        const { status, msg, isValid } = errorCheck(event);
                        this.setState((prevState) => {
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
