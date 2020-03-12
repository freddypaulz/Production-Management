import React, { Component } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { PaperBoard } from '../../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../../Components/styles/FormStyles';
import permissionCheck from '../../../Components/Auth/permissionCheck';

const styles = Styles;
export default class ProductCode extends Component {
   constructor(props) {
      super();
      this.state = {
         code_prefix: '',
         code_separator: '',
         errors: [],
         success: false
      };
      this.onEditHandler = () => {
         axios
            .post('/product-code/edit-product-code', {
               _id: '5e61d45fa171c936c86002fb',
               code_prefix: this.state.code_prefix,
               code_separator: this.state.code_separator
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
                  this.setState({
                     errors: [...res.data.errors],
                     success: true
                  });
               }
            })
            .catch(err => console.log(err));
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Product Code')) {
         axios
            .post('/product-code/product-code', {
               _id: '5e61d45fa171c936c86002fb'
            })
            .then(res => {
               this.setState({
                  code_prefix: res.data.ProductCode[0].code_prefix,
                  code_separator: res.data.ProductCode[0].code_separator
               });
            });
      }
   }
   render() {
      return (
         <Box style={styles.box} marginTop='30px'>
            <Box fontSize='30px' mb={3}>
               Product Code
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
                  Success
               </Box>
            ) : null}
            <PaperBoard>
               <Box style={styles.box_field}>
                  <Box style={styles.box} marginRight='10px'>
                     <TextField
                        fullWidth
                        required
                        value={this.state.code_prefix}
                        variant='outlined'
                        label='code Prefix'
                        type='text'
                        onChange={event => {
                           this.setState({ code_prefix: event.target.value });
                        }}
                     />
                  </Box>

                  <Box style={styles.box}>
                     <TextField
                        fullWidth
                        required
                        value={this.state.code_separator}
                        variant='outlined'
                        label='code separator'
                        type='text'
                        onChange={event => {
                           this.setState({
                              code_separator: event.target.value
                           });
                        }}
                     />
                  </Box>
               </Box>
            </PaperBoard>
            <Box
               display=' flex'
               marginTop='20px'
               justifyContent='flex-end'
               width='94%'
            >
               <Box width='100px'>
                  <Button
                     fullWidth
                     variant='contained'
                     color='primary'
                     size='large'
                     onClick={this.onEditHandler}
                  >
                     Save
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
