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
import { Datepick } from '../../Components/Date/Datepick';

const styles = Styles;
export default class AddProducts extends Component {
   constructor(props) {
      super();
      this.state = {
         product_name: '',
         product_code: '',
         product_price: '',
         product_measuring_unit: '',
         product_registration_date: null,
         description: '',
         errors: [],
         success: false,
         measuring_units: []
      };
      this.onAddHandler = () => {
         axios
            .post('/products/add-product', {
               product_name: this.state.product_name,
               product_code: this.state.product_code,
               product_price: this.state.product_price,
               product_measuring_unit: this.state.product_measuring_unit,
               product_registration_date: this.state.product_registration_date,
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
      if (permissionCheck(this.props, 'Manage Products')) {
         axios.get('/measuring-units/measuring-units').then(res => {
            console.log(res);
            this.setState({
               measuring_units: [...res.data.MeasuringUnits]
            });
         });
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Product
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
                  <Box style={styles.box} marginRight='10px'>
                     <TextField
                        fullWidth
                        required
                        variant='outlined'
                        label='Product Name'
                        type='text'
                        value={this.state.product_name}
                        onChange={event => {
                           this.setState({
                              product_name: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={styles.box}>
                     <TextField
                        fullWidth
                        required
                        value={this.state.product_code}
                        variant='outlined'
                        label='Product Code'
                        type='text'
                        onChange={event => {
                           this.setState({
                              product_code: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
               </Box>
               <Box style={styles.box_field}>
                  <TextField
                     fullWidth
                     required
                     value={this.state.product_price}
                     variant='outlined'
                     label='Product Price'
                     type='text'
                     onChange={event => {
                        this.setState({
                           product_price: event.target.value
                        });
                     }}
                  ></TextField>
               </Box>
               <Datepick
                  id='1'
                  Name='Product Registration Date'
                  Req='true'
                  marginBottom={'10px'}
                  minDate='01/01/1990'
                  maxDate={new Date()}
                  value={this.state.product_registration_date}
                  setDate={date => {
                     this.setState({
                        product_registration_date: date
                     });
                  }}
               />
               <FormControl required variant='outlined' fullWidth>
                  <InputLabel
                     style={{
                        backgroundColor: 'white',
                        paddingLeft: '2px',
                        paddingRight: '2px'
                     }}
                  >
                     Select Measuring Unit
                  </InputLabel>
                  <Select
                     style={styles.box_field}
                     required
                     value={this.state.product_measuring_unit}
                     onChange={event => {
                        console.log(event.target.value);
                        this.setState({
                           product_measuring_unit: event.target.value
                        });
                     }}
                  >
                     {this.state.measuring_units.map(
                        (measuring_unit, index) => {
                           return (
                              <MenuItem
                                 selected
                                 key={index}
                                 value={measuring_unit._id}
                              >
                                 {measuring_unit.measuring_unit_name}
                              </MenuItem>
                           );
                        }
                     )}
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
