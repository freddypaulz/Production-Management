import React, { Component } from 'react';
import { Box, TextField, Button, LinearProgress } from '@material-ui/core';
import { PaperBoard } from '../../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../../Components/styles/FormStyles';
import errorCheck from './MaterialTypeValidation';
import permissionCheck from '../../../Components/Auth/permissionCheck';

const styles = Styles;
export default class AddMaterialType extends Component {
   constructor(props) {
      super();
      this.state = {
         material_type_name: '',
         description: '',
         errors: [],
         success: false,
         fieldError: {
            material_type_name: { status: false, msg: '' },
            description: { status: false, msg: '' },
         },
         isValid: false,
         dataReceived: false,
      };
      this.onAddHandler = () => {
         this.setState({});
         if (this.state.material_type_name === '') {
            this.setState((prevState) => {
               prevState.fieldError.material_type_name.status = true;
               prevState.fieldError.material_type_name.msg = 'Name required';
            });
         } else {
            this.setState({
               dataReceived: false,
            });
            axios
               .post('/material-types/add-material-type', {
                  material_type_name: this.state.material_type_name,
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
      if (permissionCheck(this.props, 'Manage Material Types')) {
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Material Type
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
            <Box width='90%'>
               {!this.state.dataReceived ? <LinearProgress /> : null}
            </Box>
            <PaperBoard>
               <Box style={styles.box_field}>
                  <TextField
                     name='material_type_name'
                     size='small'
                     fullWidth
                     required
                     value={this.state.material_type_name}
                     variant='outlined'
                     label='Material Type Name'
                     type='text'
                     onChange={(event) => {
                        this.setState({
                           material_type_name: event.target.value,
                        });
                        const { status, msg, isValid } = errorCheck(event);
                        this.setState((prevState) => {
                           prevState.fieldError.material_type_name.status = status;
                           prevState.fieldError.material_type_name.msg = msg;
                           prevState.isValid = isValid;
                        });
                     }}
                     error={this.state.fieldError.material_type_name.status}
                     helperText={this.state.fieldError.material_type_name.msg}
                  ></TextField>
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
