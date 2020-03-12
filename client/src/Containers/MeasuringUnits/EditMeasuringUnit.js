import React, { Component } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { PaperBoard } from '../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../Components/styles/FormStyles';
import permissionCheck from '../../Components/Auth/permissionCheck';
import errorCheck from './MeasuringUnitValidation';

const styles = Styles;
export default class EditMeasuringUnit extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         measuring_unit_name: '',
         description: '',
         errors: [],
         fieldError: {
            measuring_unit_name: { status: false, msg: '' },
            description: { status: false, msg: '' }
         },
         isValid: false
      };
      this.onEditHandler = () => {
         axios
            .post('/measuring-units/edit-measuring-unit', {
               _id: this.state._id,
               measuring_unit_name: this.state.measuring_unit_name,
               description: this.state.description
            })
            .then(res => {
               console.log(res);
               if (res.data.errors) {
                  if (res.data.errors.length > 0) {
                     console.log(res.data.errors);
                     this.setState({
                        isValid: false,
                        errors: [...res.data.errors]
                     });
                  } else {
                     this.props.cancel();
                  }
               }
            })
            .catch(err => console.log(err));
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Measuring Units')) {
         console.log(this.props);
         if (this.state.measuring_unit_name === '') {
            this.setState({
               measuring_unit_name: this.props.MeasuringUnit
                  .measuring_unit_name,
               description: this.props.MeasuringUnit.description,
               _id: this.props.MeasuringUnit._id
            });
         }
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Edit Country
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
            <PaperBoard>
               <Box style={styles.box_field}>
                  <TextField
                     name='measuring_unit_name'
                     fullWidth
                     required
                     value={this.state.measuring_unit_name}
                     variant='outlined'
                     label='Measuring Unit Name'
                     type='text'
                     onChange={event => {
                        this.setState({
                           measuring_unit_name: event.target.value
                        });
                        const { status, msg, isValid } = errorCheck(event);
                        console.log(status, msg);
                        this.setState(prevState => {
                           prevState.fieldError.measuring_unit_name.status = status;
                           prevState.fieldError.measuring_unit_name.msg = msg;
                           prevState.isValid = isValid;
                        });
                     }}
                     error={this.state.fieldError.measuring_unit_name.status}
                     helperText={this.state.fieldError.measuring_unit_name.msg}
                  ></TextField>
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
