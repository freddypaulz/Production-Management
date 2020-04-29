import React, { Component } from 'react';
import { Box, TextField, Button, LinearProgress } from '@material-ui/core';
import { PaperBoard } from '../../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../../Components/styles/FormStyles';
import errorCheck from './DesignationValidation';
import permissionCheck from '../../../Components/Auth/permissionCheck';

const styles = Styles;
export default class AddDesignation extends Component {
   constructor(props) {
      super();
      this.state = {
         designation_name: '',
         description: '',
         errors: [],
         status: 'Add',
         fieldError: {
            designation_name: { status: false, msg: '' },
            description: { status: false, msg: '' },
         },
         dataReceived: false,
         isValid: false,
      };
      this.onAddHandler = () => {
         this.setState({});
         if (this.state.designation_name === '') {
            this.setState((prevState) => {
               prevState.fieldError.designation_name.status = true;
               prevState.fieldError.designation_name.msg = 'Name required';
            });
         } else {
            this.setState({
               dataReceived: false,
            });
            axios
               .post('/designations/add-designation', {
                  designation_name: this.state.designation_name,
                  description: this.state.description,
               })
               .then((res) => {
                  this.setState({
                     status: 'Add',
                  });
                  console.log(res);
                  if (res.data.errors.length > 0) {
                     console.log(res.data.errors);
                     this.setState({
                        dataReceived: true,
                        errors: [...res.data.errors],
                     });
                  } else {
                     this.setState({
                        dataReceived: true,
                     });
                     this.props.cancel();
                  }
               })
               .catch((err) => console.log(err));
         }
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Designations')) {
         this.setState({
            dataReceived: true,
         });
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Designation
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
            <Box width='94%'>
               {!this.state.dataReceived ? <LinearProgress /> : null}
            </Box>
            <PaperBoard>
               <Box style={styles.box_field}>
                  <TextField
                     size='small'
                     name='designation_name'
                     fullWidth
                     required
                     value={this.state.designation_name}
                     variant='outlined'
                     label='Designation Name'
                     type='text'
                     onChange={(event) => {
                        this.setState({
                           designation_name: event.target.value,
                        });
                        const { status, msg, isValid } = errorCheck(event);
                        this.setState((prevState) => {
                           prevState.fieldError.designation_name.status = status;
                           prevState.fieldError.designation_name.msg = msg;
                           prevState.isValid = isValid;
                        });
                     }}
                     error={this.state.fieldError.designation_name.status}
                     helperText={this.state.fieldError.designation_name.msg}
                  />
               </Box>

               <Box style={styles.box_field}>
                  <TextField
                     name='description'
                     size='small'
                     fullWidth
                     required
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
                  ></TextField>
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
