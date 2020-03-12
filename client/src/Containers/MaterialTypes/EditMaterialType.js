import React, { Component } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { PaperBoard } from '../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../Components/styles/FormStyles';
import permissionCheck from '../../Components/Auth/permissionCheck';

const styles = Styles;
export default class EditMaterialType extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         material_type_name: '',
         description: '',
         errors: [],
         success: false
      };
      this.onEditHandler = () => {
         axios
            .post('/material-types/edit-material-type', {
               _id: this.state._id,
               material_type_name: this.state.material_type_name,
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
      if (permissionCheck(this.props, 'Manage Material Types')) {
         console.log(this.props);
         if (this.state.material_type_name === '') {
            this.setState({
               material_type_name: this.props.MaterialType.material_type_name,
               description: this.props.MaterialType.description,
               _id: this.props.MaterialType._id
            });
         }
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Edit Material Type
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
                     value={this.state.material_type_name}
                     variant='outlined'
                     label='Material Type Name'
                     type='text'
                     onChange={event => {
                        this.setState({
                           material_type_name: event.target.value
                        });
                     }}
                  ></TextField>
               </Box>

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
                     Update
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
