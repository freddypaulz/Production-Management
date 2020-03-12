import React, { Component } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { PaperBoard } from '../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../Components/styles/FormStyles';
import permissionCheck from '../../Components/Auth/permissionCheck';

const styles = Styles;
export default class AddDesignation extends Component {
   constructor(props) {
      super();
      this.state = {
         designation_name: '',
         description: '',
         errors: [],
         status: 'Add'
      };
      this.onAddHandler = () => {
         this.setState({
            status: 'wait..'
         });
         axios
            .post('/designations/add-designation', {
               designation_name: this.state.designation_name,
               description: this.state.description
            })
            .then(res => {
               this.setState({
                  status: 'Add'
               });
               console.log(res);
               if (res.data.errors.length > 0) {
                  console.log(res.data.errors);
                  this.setState({
                     errors: [...res.data.errors]
                  });
               } else {
                  this.props.cancel();
               }
            })
            .catch(err => console.log(err));
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Manage Designations')) {
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Designation
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
                     onClick={this.onAddHandler}
                  >
                     {this.state.status}
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
