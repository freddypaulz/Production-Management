import React, { Component } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { PaperBoard } from '../../Components/PaperBoard/PaperBoard';
import AccountBoxOutlinedIcon from '@material-ui/icons/AccountBoxOutlined';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import axios from 'axios';
import auth from '../../Components/Auth/auth';
// import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
// import { yellow } from '@material-ui/core/colors';

const styles = {
   box: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px'
   }
};

// const theme = createMuiTheme({
//    palette: {
//       primary: yellow
//    }
// });

export default class Login extends Component {
   componentDidMount() {
      auth.logout();
      if (this.props.history.location.state) {
         if (this.props.history.location.state.Errors[0]) {
            this.setState({
               errors: this.props.history.location.state.Errors
            });
         }
      }
   }
   constructor(props) {
      super(props);
      this.state = {
         user_name: '',
         password: '',
         success: false,
         errors: []
      };
   }

   render() {
      return (
         <Box
            flexDirection='column'
            height='100vh'
            bgcolor='#3f51b5'
            style={styles.box}
         >
            {/* <ThemeProvider theme={theme}>
               <Checkbox defaultChecked color='primary' />
            </ThemeProvider> */}
            <Box width='30vw'>
               <PaperBoard>
                  <Box
                     style={{ fontWeight: 'bolder', color: '#3f51b5' }}
                     fontSize='3vw'
                     mb={3}
                  >
                     Login
                  </Box>
                  <Box style={styles.box}>
                     <AccountBoxOutlinedIcon
                        style={{
                           fontSize: '40px',
                           marginRight: '10px'
                        }}
                        color='primary'
                     ></AccountBoxOutlinedIcon>
                     <TextField
                        color='primary'
                        size='small'
                        fullWidth
                        required
                        variant='outlined'
                        label='User Name'
                        type='text'
                        onChange={event => {
                           this.setState({ user_name: event.target.value });
                        }}
                     ></TextField>
                  </Box>
                  <Box style={styles.box}>
                     <VpnKeyIcon
                        style={{
                           fontSize: '40px',
                           marginRight: '10px'
                        }}
                        color='primary'
                     ></VpnKeyIcon>
                     <TextField
                        size='small'
                        variant='outlined'
                        fullWidth
                        label='Password'
                        required
                        type='password'
                        onChange={event => {
                           this.setState({ password: event.target.value });
                        }}
                     ></TextField>
                  </Box>
                  <Button
                     variant='contained'
                     size='large'
                     color='primary'
                     onClick={() => {
                        axios
                           .post('/users/login', {
                              name: this.state.user_name,
                              password: this.state.password
                           })
                           .then(res => {
                              if (res.data.name === this.state.user_name) {
                                 console.log('User: ', res.data);
                                 sessionStorage.setItem(
                                    'User Name',
                                    res.data.name
                                 );
                                 sessionStorage.setItem(
                                    'User ID',
                                    res.data.employee_id
                                       ? res.data.employee_id
                                       : 'not specified'
                                 );
                                 console.log(
                                    'User ID: ',
                                    sessionStorage.getItem('User ID')
                                 );
                                 sessionStorage.setItem(
                                    'Role ID',
                                    res.data.role
                                 );
                                 auth.login(
                                    res.data.name === this.state.user_name
                                 );
                                 axios
                                    .post('roles/role', {
                                       _id: res.data.role
                                    })
                                    .then(res => {
                                       let permissions = [];
                                       console.log(res.data);
                                       res.data.Role[0].permissions.map(
                                          permission => {
                                             permissions.push(permission.name);
                                             return null;
                                          }
                                       );
                                       sessionStorage.setItem(
                                          'permissions',
                                          JSON.stringify(permissions)
                                       );
                                       this.props.history.push('/home');
                                    })
                                    .catch(err => {
                                       console.log(err);
                                       this.setState({
                                          errors: [
                                             'Problem in user. Contact Administrator'
                                          ]
                                       });
                                    });
                              } else {
                                 console.log(res.data.message);
                                 this.setState({
                                    errors: res.data.message
                                 });
                              }
                           })
                           .catch(err => {
                              this.setState({
                                 errors: ['Could not reach the server']
                              });
                              console.log(err);
                           });
                     }}
                  >
                     Login
                  </Button>
                  {this.state.errors.length > 0 ? (
                     this.state.errors.map((error, index) => {
                        return error != null ? (
                           <Box
                              key={index}
                              bgcolor='#f73067'
                              marginTop='10px'
                              padding='10px'
                              width='90%'
                              textAlign='center'
                           >
                              {error}
                           </Box>
                        ) : (
                           <Box key={index}></Box>
                        );
                     })
                  ) : (
                     <Box></Box>
                  )}
               </PaperBoard>
            </Box>
         </Box>
      );
   }
}
