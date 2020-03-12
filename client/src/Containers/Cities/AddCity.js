import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   Divider
} from '@material-ui/core';
import { PaperBoard } from '../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../Components/styles/FormStyles';
import permissionCheck from '../../Components/Auth/permissionCheck';

const styles = Styles;
export default class AddUser extends Component {
   constructor(props) {
      super();
      this.state = {
         city_name: '',
         state_id: '',
         description: '',
         errors: [],
         success: false,
         states: [],
         bulk_upload: []
      };
      this.onAddHandler = () => {
         axios
            .post('/cities/add-city', {
               city_name: this.state.city_name,
               state_id: this.state.state_id,
               description: this.state.description
            })
            .then(res => {
               console.log(res);
               if (res.data.errors.length > 0) {
                  console.log(res.data.errors);
                  this.setState({
                     errors: [...res.data.errors],
                     success: false
                  });
               } else {
                  this.props.cancel();
               }
            })
            .catch(err => console.log(err));
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Cities')) {
         axios.get('/states/states').then(res => {
            this.setState({
               states: [...res.data.States]
            });
         });
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add City
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
                     value={this.state.city_name}
                     variant='outlined'
                     label='City Name'
                     type='text'
                     onChange={event => {
                        this.setState({ city_name: event.target.value });
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
                     Select State
                  </InputLabel>
                  <Select
                     style={styles.box_field}
                     required
                     //variant='outlined'
                     value={this.state.state_id}
                     onChange={event => {
                        console.log(event.target.value);
                        this.setState({
                           state_id: event.target.value
                        });
                     }}
                  >
                     {this.state.states.map((state, index) => {
                        return (
                           <MenuItem selected key={index} value={state._id}>
                              {state.state_name}
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
               <Divider />
               <Box></Box>
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
