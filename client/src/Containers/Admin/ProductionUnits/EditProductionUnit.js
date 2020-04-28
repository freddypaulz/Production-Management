import React, { Component } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { PaperBoard } from '../../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../../Components/styles/FormStyles';
import errorCheck from './ProductionUnitValidation';
import permissionCheck from '../../../Components/Auth/permissionCheck';

const styles = Styles;
export default class EditProductionUnit extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         production_unit_name: '',
         description: '',
         errors: [],
         fieldError: {
            production_unit_name: { status: false, msg: '' },
            description: { status: false, msg: '' }
         },
         isValid: false
      };
      this.onEditHandler = () => {
         this.setState({});
         if (this.state.production_unit_name === '') {
            this.setState(prevState => {
               prevState.fieldError.production_unit_name.status = true;
               prevState.fieldError.production_unit_name.msg = 'Name required';
            });
         } else {
            axios
               .post('/production-units/edit-production-unit', {
                  _id: this.state._id,
                  production_unit_name: this.state.production_unit_name,
                  description: this.state.description
               })
               .then(res => {
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
      if (permissionCheck(this.props.props, 'Manage Production Units')) {
         console.log(this.props);
         if (this.state.production_unit_name === '') {
            this.setState({
               production_unit_name: this.props.ProductionUnit
                  .production_unit_name,
               description: this.props.ProductionUnit.description,
               _id: this.props.ProductionUnit._id
            });
         }
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Edit Production Unit
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
                     name='production_unit_name'
                     size='small'
                     fullWidth
                     required
                     value={this.state.production_unit_name}
                     variant='outlined'
                     label='Production Units Name'
                     type='text'
                     onChange={event => {
                        this.setState({
                           production_unit_name: event.target.value
                        });
                        const { status, msg, isValid } = errorCheck(event);
                        this.setState(prevState => {
                           prevState.fieldError.production_unit_name.status = status;
                           prevState.fieldError.production_unit_name.msg = msg;
                           prevState.isValid = isValid;
                        });
                     }}
                     error={this.state.fieldError.production_unit_name.status}
                     helperText={this.state.fieldError.production_unit_name.msg}
                  />
               </Box>

               <Box style={styles.box_field}>
                  <TextField
                     name='description'
                     size='small'
                     fullWidth
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
