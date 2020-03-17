import React, { Component } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import axios from 'axios';
import Styles from '../styles/FormStyles';

const styles = Styles;
export default class AddMethod extends Component {
   constructor(props) {
      super();
      this.state = {
         Method_Name: '',
         Description: '',
         Value: false
      };

      this.onAddHandler = () => {
         console.log('');
         axios
            .post('/qc-method/add', {
               Method_Name: this.state.Method_Name,
               Value: this.state.Value,
               Description: this.state.Description
            })
            .then(res => {
               console.log(res);
               //   if (res.data.errors.length > 0) {
               //     console.log(res.data.errors);
               //     this.setState({
               //       errors: [...res.data.errors]
               //     });
               //   } else {
               this.props.cancel();
               //   }
            });
         // .catch(err => console.log(err));
      };
   }
   // componentDidMount() {
   //   // if (permissionCheck(this.props, "Manage Measuring Units")) {
   //   this.setState({
   //     isValid: false
   //   });
   //   // }
   // }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Method
            </Box>
            {/* {this.state.errors.length > 0
          ? this.state.errors.map((error, index) => {
              return (
                <Box style={styles.box_msg} bgcolor="#f73067" key={index}>
                  {error}
                </Box>
              );
            })
          : null} */}
            {/* <PaperBoard> */}
            <Box style={styles.box_field}>
               <TextField
                  name='Method_Name'
                  fullWidth
                  size='small'
                  required
                  value={this.state.Method_Name}
                  variant='outlined'
                  label='Method Name'
                  type='text'
                  onChange={event => {
                     this.setState({
                        Method_Name: event.target.value
                     });
                     console.log(event);
                  }}
               ></TextField>
            </Box>
            <Box style={styles.box_field}>
               <TextField
                  name='Value'
                  fullWidth
                  size='small'
                  required
                  value={this.state.Value}
                  variant='outlined'
                  label='Value'
                  type='text'
                  onChange={event => {
                     this.setState({
                        Value: event.target.value
                     });
                     console.log(event);
                  }}
               ></TextField>
            </Box>

            <Box style={styles.box_field}>
               <TextField
                  name='Description'
                  size='small'
                  multiline
                  rowsMax={4}
                  fullWidth
                  required
                  value={this.state.Description}
                  variant='outlined'
                  label='Description'
                  type='text'
                  onChange={event => {
                     this.setState({
                        Description: event.target.value
                     });
                  }}
               ></TextField>
            </Box>
            {/* </PaperBoard> */}
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
                     // disabled={!this.state.isValid}
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
