import React, { Component } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { PaperBoard } from '../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../Components/styles/FormStyles';
import permissionCheck from '../../Components/Auth/permissionCheck';

const styles = Styles;
export default class EditBox extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         box_name: '',
         box_size: '',
         description: '',
         errors: [],
         status: 'Add'
      };
      this.onEditHandler = () => {
         this.setState({
            status: 'wait..'
         });
         axios
            .post('/boxes/edit-box', {
               _id: this.state._id,
               box_name: this.state.box_name,
               box_size: this.state.box_size,
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
      if (permissionCheck(this.props.props, 'Manage Boxes')) {
         console.log(this.props);
         if (this.state.box_name === '') {
            this.setState({
               box_name: this.props.Box.box_name,
               box_size: this.props.Box.box_size,
               description: this.props.Box.description,
               _id: this.props.Box._id
            });
         }
      }
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Edit Box
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
                     value={this.state.box_name}
                     variant='outlined'
                     label='Box Name'
                     type='text'
                     onChange={event => {
                        this.setState({
                           box_name: event.target.value
                        });
                     }}
                  />
               </Box>

               <Box style={styles.box_field}>
                  <TextField
                     fullWidth
                     required
                     value={this.state.box_size}
                     variant='outlined'
                     label='Box Size'
                     type='text'
                     onChange={event => {
                        this.setState({
                           box_size: event.target.value
                        });
                     }}
                  />
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
                     {this.state.status}
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
