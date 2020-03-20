import React, { Component } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { PaperBoard } from '../../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../../Components/styles/FormStyles';
import permissionCheck from '../../../Components/Auth/permissionCheck';
import errorCheck from './BoxValidation';

const styles = Styles;
export default class EditBox extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         box_name: '',
         box_size: '',
         description: '',
         errors: [],
         status: 'Add',
         fieldError: {
            box_name: { status: false, msg: '' },
            box_size: { status: false, msg: '' },
            description: { status: false, msg: '' }
         },
         isValid: false
      };
      this.onEditHandler = () => {
         this.setState({});
         if (this.state.box_name === '') {
            this.setState(prevState => {
               prevState.fieldError.box_name.status = true;
               prevState.fieldError.box_name.msg = 'Name required';
            });
         } else if (this.state.box_size <= 0) {
            this.setState(prevState => {
               prevState.fieldError.box_size.status = true;
               prevState.fieldError.box_size.msg = 'Enter a positive value';
            });
         } else {
            axios
               .post('/boxes/edit-box', {
                  _id: this.state._id,
                  box_name: this.state.box_name,
                  box_size: this.state.box_size,
                  description: this.state.description
               })
               .then(res => {
                  this.setState({
                     status: 'Update'
                  });
                  console.log(res);
                  if (res.data.errors) {
                     if (res.data.errors.length > 0) {
                        console.log(res.data.errors);
                        this.setState({
                           errors: [...res.data.errors]
                        });
                     } else {
                        this.props.cancel();
                     }
                  }
               })
               .catch(err => console.log(err));
         }
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props.props, 'Manage Boxes')) {
         console.log(this.props);
         if (this.state.box_name === '') {
            this.setState({
               box_name: this.props.Box.box_name,
               box_size: this.props.Box.box_size,
               description: this.props.Box.description,
               _id: this.props.Box._id
            });
         }
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Edit Box
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
                     name='box_name'
                     fullWidth
                     required
                     value={this.state.box_name}
                     variant='outlined'
                     label='Box Name'
                     type='text'
                     onChange={event => {
                        this.setState({
                           box_name: event.target.value
                        });
                        const { status, msg, isValid } = errorCheck(event);
                        this.setState(prevState => {
                           prevState.fieldError.box_name.status = status;
                           prevState.fieldError.box_name.msg = msg;
                           prevState.isValid = isValid;
                        });
                     }}
                     error={this.state.fieldError.box_name.status}
                     helperText={this.state.fieldError.box_name.msg}
                  />
               </Box>

               <Box style={styles.box_field}>
                  <TextField
                     fullWidth
                     required
                     name='box_size'
                     value={this.state.box_size}
                     variant='outlined'
                     label='Box Size'
                     type='number'
                     onChange={event => {
                        this.setState({
                           box_size: event.target.value
                        });
                        const { status, msg, isValid } = errorCheck(event);
                        this.setState(prevState => {
                           prevState.fieldError.box_size.status = status;
                           prevState.fieldError.box_size.msg = msg;
                           prevState.isValid = isValid;
                        });
                     }}
                     error={this.state.fieldError.box_size.status}
                     helperText={this.state.fieldError.box_size.msg}
                  />
               </Box>

               <Box style={styles.box_field}>
                  <TextField
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
                     onClick={this.onEditHandler}
                  >
                     {this.state.status}
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
