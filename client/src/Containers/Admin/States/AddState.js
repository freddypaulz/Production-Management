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
import permissionCheck from '../../../Components/Auth/permissionCheck';
import Autocomplete from '@material-ui/lab/Autocomplete';

const styles = Styles;
export default class AddUser extends Component {
   constructor(props) {
      super();
      this.state = {
         state_name: '',
         country_id: '',
         description: '',
         errors: [],
         success: false,
         states: [],
         Countries: [],
         fieldError: {
            state_name: { status: false, msg: '' },
            country: { status: false, msg: '' },
            description: { status: false, msg: '' },
         },
         isValid: false,
         dataReceived: false,
      };
      this.onAddHandler = () => {
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
               .post('/states/add-state', {
                  state_name: this.state.state_name,
                  country_id: this.state.country_id,
                  description: this.state.description,
               })
               .then((res) => {
                  console.log(res);
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
               Countries: [...res.data.Countries],
               dataReceived: true,
            });
         });
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add State
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
                     options={this.state.Countries}
                     getOptionLabel={(option) => option.country_name}
                     renderInput={(params) => (
                        <TextField
                           {...params}
                           required
                           label='Select Country'
                           variant='outlined'
                        />
                     )}
                     value={this.state.distributor_country}
                     onChange={(event, value) => {
                        console.log(value);
                        this.setState({
                           country_id: value,
                        });
                     }}
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
                     onClick={this.onAddHandler}
                  >
                     Add
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
