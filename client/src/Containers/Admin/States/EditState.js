import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   FormControl,
   LinearProgress,
} from '@material-ui/core';
import { PaperBoard } from '../../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../../Components/styles/FormStyles';
import errorCheck from './StateValidation';
import Autocomplete from '@material-ui/lab/Autocomplete';
import permissionCheck from '../../../Components/Auth/permissionCheck';

const styles = Styles;
export default class EditShift extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         state_name: '',
         country_id: '',
         description: '',
         errors: [],
         success: false,
         countries: [],
         fieldError: {
            state_name: { status: false, msg: '' },
            country: { status: false, msg: '' },
            description: { status: false, msg: '' },
         },
         isValid: false,
         dataReceived: false,
      };
      this.onGetCountry = (_id) => {
         axios
            .post('/countries/country', {
               _id,
            })
            .then((res) => {
               console.log(res.data.Country[0]);
               this.setState({
                  country_id: res.data.Country[0],
               });
            });
      };
      this.onEditHandler = () => {
         if (this.state.country_id === '') {
            this.setState({});
            this.setState((prevState) => {
               prevState.fieldError.country.status = true;
            });
            this.setState({
               errors: ['Select Country'],
            });
         } else {
            this.setState({
               dataReceived: false,
            });
            axios
               .post('/states/edit-state', {
                  _id: this.state._id,
                  state_name: this.state.state_name,
                  country_id: this.state.country_id,
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
      if (permissionCheck(this.props, 'Manage States')) {
         this.setState({
            dataReceived: false,
         });
         axios.get('/countries/countries').then((res) => {
            this.setState({
               countries: [...res.data.Countries],
            });
            this.onGetCountry(this.props.state.country_id);
            if (this.state.state_name === '') {
               console.log(this.props.state);
               this.setState({
                  _id: this.props.state._id,
                  state_name: this.props.state.state_name,
                  description: this.props.state.description,
                  dataReceived: true,
               });
            }
         });
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Edit State
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
                     size='small'
                     name='state_name'
                     fullWidth
                     required
                     value={this.state.state_name}
                     variant='outlined'
                     label='State Name'
                     type='text'
                     onChange={(event) => {
                        this.setState({ state_name: event.target.value });
                        const { status, msg, isValid } = errorCheck(event);
                        this.setState((prevState) => {
                           prevState.fieldError.state_name.status = status;
                           prevState.fieldError.state_name.msg = msg;
                           prevState.isValid = isValid;
                        });
                     }}
                     error={this.state.fieldError.state_name.status}
                     helperText={this.state.fieldError.state_name.msg}
                  ></TextField>
               </Box>
               <FormControl
                  size='small'
                  variant='outlined'
                  fullWidth
                  display='flex'
                  marginBottom='10px'
               >
                  <Autocomplete
                     size='small'
                     id='country'
                     disableClearable={true}
                     options={this.state.countries}
                     getOptionLabel={(option) => option.country_name}
                     renderInput={(params) => (
                        <TextField
                           {...params}
                           required
                           label='Select Country'
                           variant='outlined'
                        />
                     )}
                     value={this.state.country_id}
                     onChange={(event, value) => {
                        console.log(value);
                        this.setState({
                           country_id: value,
                           isValid: true,
                        });
                        this.setState((prevState) => {
                           prevState.fieldError.country.status = false;
                        });
                        this.setState({
                           errors: [],
                        });
                     }}
                     error={this.state.fieldError.country.status}
                  />
               </FormControl>

               <Box mt='10px' style={styles.box_field}>
                  <TextField
                     size='small'
                     name='description'
                     fullWidth
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
                     onClick={this.onEditHandler}
                  >
                     Add
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
