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
export default class AddRawMaterial extends Component {
   constructor(props) {
      super();
      this.state = {
         raw_material_name: '',
         raw_material_code: '',
         raw_material_type: '',
         raw_material_measuring_unit: '',
         description: '',
         errors: [],
         success: false,
         material_types: [],
         measuring_units: []
      };
      this.onAddHandler = () => {
         axios
            .post('/raw-materials/add-raw-material', {
               raw_material_name: this.state.raw_material_name,
               raw_material_code: this.state.raw_material_code,
               raw_material_type: this.state.raw_material_type,
               raw_material_measuring_unit: this.state
                  .raw_material_measuring_unit,
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
      if (permissionCheck(this.props, 'Manage Raw Materials')) {
         axios.get('/material-types/material-types').then(res => {
            this.setState({
               material_types: [...res.data.MaterialTypes]
            });
         });
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
               Add Raw Material
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
                        value={this.state.raw_material_name}
                        variant='outlined'
                        label='Raw Material Name'
                        type='text'
                        onChange={event => {
                           this.setState({
                              raw_material_name: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={styles.box}>
                     <TextField
                        fullWidth
                        required
                        value={this.state.raw_material_code}
                        variant='outlined'
                        label='Raw Material Code'
                        type='text'
                        onChange={event => {
                           this.setState({
                              raw_material_code: event.target.value
                           });
                        }}
                     ></TextField>
                  </Box>
               </Box>
               <FormControl required variant='outlined' fullWidth>
                  <InputLabel
                     style={{
                        backgroundColor: 'white',
                        paddingLeft: '2px',
                        paddingRight: '2px'
                     }}
                  >
                     Select Raw Material Type
                  </InputLabel>
                  <Select
                     style={styles.box_field}
                     required
                     //variant='outlined'
                     value={this.state.raw_material_type}
                     onChange={event => {
                        console.log(event.target.value);
                        this.setState({
                           raw_material_type: event.target.value
                        });
                     }}
                  >
                     {this.state.material_types.map((material_type, index) => {
                        return (
                           <MenuItem
                              selected
                              key={index}
                              value={material_type._id}
                           >
                              {material_type.material_type_name}
                           </MenuItem>
                        );
                     })}
                  </Select>
               </FormControl>
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
                     value={this.state.raw_material_measuring_unit}
                     onChange={event => {
                        console.log(event.target.value);
                        this.setState({
                           raw_material_measuring_unit: event.target.value
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
