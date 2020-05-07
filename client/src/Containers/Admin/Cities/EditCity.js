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
import errorCheck from './CityValidation';
import Autocomplete from '@material-ui/lab/Autocomplete';
import permissionCheck from '../../../Components/Auth/permissionCheck';

const styles = Styles;
export default class EditShift extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         city_name: '',
         state_id: '',
         description: '',
         errors: [],
         success: false,
         states: [],
         fieldError: {
            city_name: { status: false, msg: '' },
            state: { status: false, msg: '' },
            description: { status: false, msg: '' },
         },
         isValid: false,
         dataReceived: false,
      };
      this.onGetState = (_id) => {
         axios
            .post('/states/state', {
               _id,
            })
            .then((res) => {
               this.setState({
                  state_id: res.data.state[0],
               });
            });
      };
      this.onEditHandler = () => {
         if (this.state.state_id === '') {
            this.setState({});
            this.setState((prevState) => {
               prevState.fieldError.state.status = true;
            });
            this.setState({
               errors: ['Select State'],
            });
         } else {
            this.setState({
               dataReceived: false,
            });
            axios
               .post('/cities/edit-city', {
                  _id: this.state._id,
                  city_name: this.state.city_name,
                  state_id: this.state.state_id,
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
      if (permissionCheck(this.props, 'Manage Cities')) {
         this.setState({
            dataReceived: false,
         });
         axios.get('/states/states').then((res) => {
            this.setState({
               states: [...res.data.States],
            });
            this.onGetState(this.props.city.state_id);
            if (this.state.city_name === '') {
               this.setState({
                  _id: this.props.city._id,
                  city_name: this.props.city.city_name,
                  description: this.props.city.description,
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
               Edit City
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
                     name='city_name'
                     fullWidth
                     required
                     value={this.state.city_name}
                     variant='outlined'
                     label='City Name'
                     type='text'
                     onChange={(event) => {
                        this.setState({ city_name: event.target.value });
                        const { status, msg, isValid } = errorCheck(event);
                        this.setState((prevState) => {
                           prevState.fieldError.city_name.status = status;
                           prevState.fieldError.city_name.msg = msg;
                           prevState.isValid = isValid;
                        });
                     }}
                     error={this.state.fieldError.city_name.status}
                     helperText={this.state.fieldError.city_name.msg}
                  />
               </Box>
               {/* <FormControl required variant='outlined' fullWidth size='small'>
                  <InputLabel
                     style={{
                        backgroundColor: 'white',
                        paddingLeft: '2px',
                        paddingRight: '2px',
                     }}
                  >
                     Select State
                  </InputLabel>
                  <Select
                     name='state'
                     style={styles.box_field}
                     required
                     //variant='outlined'
                     value={this.state.state_id}
                     onChange={(event) => {
                        console.log(event.target.value);
                        this.setState({
                           state_id: event.target.value,
                           isValid: true,
                        });
                        this.setState((prevState) => {
                           prevState.fieldError.state.status = false;
                        });
                        this.setState({
                           errors: [],
                        });
                     }}
                     error={this.state.fieldError.state.status}
                  >
                     {this.state.states.map((state, index) => {
                        return (
                           <MenuItem selected key={index} value={state._id}>
                              {state.state_name}
                           </MenuItem>
                        );
                     })}
                  </Select>
               </FormControl> */}
               <FormControl
                  size='small'
                  variant='outlined'
                  fullWidth
                  display='flex'
               >
                  <Autocomplete
                     size='small'
                     id='state'
                     disableClearable={true}
                     options={this.state.states}
                     getOptionLabel={(option) => option.state_name}
                     renderInput={(params) => (
                        <TextField
                           {...params}
                           required
                           label='Select State'
                           variant='outlined'
                        />
                     )}
                     value={this.state.state_id}
                     onChange={(event, value) => {
                        console.log(value);
                        this.setState({
                           state_id: value,
                           isValid: true,
                        });
                        this.setState((prevState) => {
                           prevState.fieldError.state.status = false;
                        });
                        this.setState({
                           errors: [],
                        });
                     }}
                     error={this.state.fieldError.state.status}
                  />
               </FormControl>

               <Box mt='10px' style={styles.box_field}>
                  <TextField
                     size='small'
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
                     Update
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
