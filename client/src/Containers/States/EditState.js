import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   FormControl,
   InputLabel,
   Select,
   MenuItem
} from '@material-ui/core';
import { PaperBoard } from '../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../Components/styles/FormStyles';
import permissionCheck from '../../Components/Auth/permissionCheck';

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
         countries: []
      };
      this.onEditHandler = () => {
         axios
            .post('/states/edit-state', {
               _id: this.state._id,
               state_name: this.state.state_name,
               country_id: this.state.country_id,
               description: this.state.description
            })
            .then(res => {
               console.log(res);
               if (res.data.errors) {
                  if (res.data.errors.length > 0) {
                     console.log(res.data.errors);
                     this.setState({
                        errors: [...res.data.errors],
                        success: false
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
      if (permissionCheck(this.props, 'Manage States')) {
         axios.get('/countries/countries').then(res => {
            this.setState({
               countries: [...res.data.Countries]
            });
            if (this.state.state_name === '') {
               console.log(this.props.state);
               this.setState({
                  _id: this.props.state._id,
                  state_name: this.props.state.state_name,
                  country_id: this.props.state.country_id,
                  description: this.props.state.description
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
            <PaperBoard>
               <Box style={styles.box_field}>
                  <TextField
                     fullWidth
                     required
                     value={this.state.state_name}
                     variant='outlined'
                     label='State Name'
                     type='text'
                     onChange={event => {
                        this.setState({ state_name: event.target.value });
                     }}
                  ></TextField>
               </Box>
               <FormControl required variant='outlined' fullWidth>
                  <InputLabel
                     style={{
                        backgroundColor: 'white',
                        paddingLeft: '2px',
                        paddingRight: '2px'
                     }}
                  >
                     Select Country
                  </InputLabel>
                  <Select
                     style={styles.box_field}
                     required
                     //variant='outlined'
                     value={this.state.country_id}
                     onChange={event => {
                        console.log(event.target.value);
                        this.setState({
                           country_id: event.target.value
                        });
                     }}
                  >
                     {this.state.countries.map((country, index) => {
                        return (
                           <MenuItem selected key={index} value={country._id}>
                              {country.country_name}
                           </MenuItem>
                        );
                     })}
                  </Select>
               </FormControl>

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
                     }}
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
