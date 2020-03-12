import React, { Component } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { PaperBoard } from '../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../Components/styles/FormStyles';
import permissionCheck from '../../Components/Auth/permissionCheck';

const styles = Styles;
export default class EditDesignation extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         designation_name: '',
         description: '',
         errors: [],
         status: 'Add'
      };
      this.onEditHandler = () => {
         this.setState({
            status: 'wait..'
         });
         axios
            .post('/designations/edit-designation', {
               _id: this.state._id,
               designation_name: this.state.designation_name,
               description: this.state.description
            })
            .then(res => {
               this.setState({
                  status: 'Update'
               });
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
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props.props, 'Manage Designations')) {
         console.log(this.props);
         if (this.state.designation_name === '') {
            this.setState({
               designation_name: this.props.Designation.designation_name,
               description: this.props.Designation.description,
               _id: this.props.Designation._id
            });
         }
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Edit Designation
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
                     fullWidth
                     required
                     value={this.state.designation_name}
                     variant='outlined'
                     label='Designation Name'
                     type='text'
                     onChange={event => {
                        this.setState({
                           designation_name: event.target.value
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
                     {this.state.status}
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
