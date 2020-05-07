import React, { Component } from 'react';
import { Box, TextField, Button, LinearProgress } from '@material-ui/core';
import { PaperBoard } from '../../../../Components/PaperBoard/PaperBoard';
import axios from 'axios';
import Styles from '../../../../Components/styles/FormStyles';
import permissionCheck from '../../../../Components/Auth/permissionCheck';

const styles = Styles;
export default class Currency extends Component {
   constructor(props) {
      super();
      this.state = {
         currency_type: '',
         currency_separator: '',
         errors: [],
         success: false,
         dataReceived: false,
      };
      this.onEditHandler = () => {
         this.setState({
            dataReceived: false,
         });
         axios
            .post('/currency/edit-currency', {
               _id: '5eb2a1fcfcdc3a03f401855e',
               currency_type: this.state.currency_type,
               currency_separator: this.state.currency_separator,
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
                     errors: [...res.data.errors],
                     success: true,
                     dataReceived: true,
                  });
               }
            })
            .catch((err) => console.log(err));
      };
   }
   componentDidMount() {
      if (permissionCheck(this.props, 'Currency')) {
         this.setState({
            dataReceived: false,
         });
         axios
            .post('/currency/currency', {
               _id: '5eb2a1fcfcdc3a03f401855e',
            })
            .then((res) => {
               this.setState({
                  currency_type: res.data.Currency[0].currency_type,
                  currency_separator: res.data.Currency[0].currency_separator,
                  dataReceived: true,
               });
            });
      }
   }
   render() {
      return (
         <Box style={styles.box} marginTop='30px'>
            <Box fontSize='30px' mb={3}>
               Currency
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
            <Box width='94%'>
               {!this.state.dataReceived ? <LinearProgress /> : null}
            </Box>
            <PaperBoard>
               <Box style={styles.box_field}>
                  <Box style={styles.box} marginRight='10px'>
                     <TextField
                        fullWidth
                        required
                        value={this.state.currency_type}
                        variant='outlined'
                        label='Currency Type'
                        type='text'
                        onChange={(event) => {
                           console.log(event.target.value);
                           this.setState({ currency_type: event.target.value });
                        }}
                     />
                  </Box>

                  <Box style={styles.box}>
                     <TextField
                        fullWidth
                        required
                        value={this.state.currency_separator}
                        variant='outlined'
                        label='Currency Separator'
                        type='text'
                        onChange={(event) => {
                           this.setState({
                              currency_separator: event.target.value,
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
