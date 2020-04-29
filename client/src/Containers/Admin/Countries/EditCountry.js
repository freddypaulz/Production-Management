import React, { Component } from 'react';
import { Box, TextField, Button, LinearProgress } from '@material-ui/core';
import { PaperBoard } from '../../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../../Components/styles/FormStyles';
import errorCheck from './CountryValidation';
import permissionCheck from '../../../Components/Auth/permissionCheck';

const styles = Styles;
export default class EditCountry extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         country_name: '',
         description: '',
         errors: [],
         success: false,
         fieldError: {
            country_name: { status: false, msg: '' },
            description: { status: false, msg: '' },
         },
         dataReceived: false,
         isValid: false,
      };
      this.onEditHandler = () => {
         this.setState({
            dataReceived: false,
         });
         axios
            .post('/countries/edit-country', {
               _id: this.state._id,
               country_name: this.state.country_name,
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
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Countries')) {
         console.log(this.props);
         if (this.state.country_name === '') {
            this.setState({
               country_name: this.props.country.country_name,
               description: this.props.country.description,
               _id: this.props.country._id,
               dataReceived: true,
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
            <Box width='94%'>
               {!this.state.dataReceived ? <LinearProgress /> : null}
            </Box>
            <PaperBoard>
               <Box style={styles.box_field}>
                  <TextField
                     name='country_name'
                     fullWidth
                     required
                     value={this.state.country_name}
                     variant='outlined'
                     label='Country Name'
                     type='text'
                     size='small'
                     onChange={(event) => {
                        this.setState({ country_name: event.target.value });
                        const { status, msg, isValid } = errorCheck(event);
                        this.setState((prevState) => {
                           prevState.fieldError.country_name.status = status;
                           prevState.fieldError.country_name.msg = msg;
                           prevState.isValid = isValid;
                        });
                     }}
                     error={this.state.fieldError.country_name.status}
                     helperText={this.state.fieldError.country_name.msg}
                  ></TextField>
               </Box>

               <Box style={styles.box_field}>
                  <TextField
                     name='description'
                     fullWidth
                     value={this.state.description}
                     variant='outlined'
                     label='Description'
                     type='text'
                     size='small'
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
