import React, { Component } from 'react';
import Styles from './styles/FormStyles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Datepick } from '../../../Components/Date/Datepick';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import moment from 'moment';
import {
   Box,
   TextField,
   Button,
   Select,
   FormControl,
   InputLabel,
   MenuItem,
   LinearProgress,
} from '@material-ui/core';
import axios from 'axios';

const styles = Styles;
const style = {
   marginRight: '6px',
   marginLeft: '6px',
};

class Add_Purchase_Stock extends Component {
   constructor(props) {
      super();
      this.state = {
         invoice_quantity: null,
         unitList: [],
         roleList: [],
         munit: '',
         vendors: [],
         vendor: '',
         invoice_amount: null,
         invoice_date: null,
         invoice_document_url: [],
         status: '',
         file: [],
         Id: [{ id: '' }],
         a_id: '',
         idType: '',
         submitBtnDisable: false,
         progress: false,
      };

      this.loadStatus = () => {
         let status = ['Purchase-Completed'];
         return status.map((msg, index) => (
            <MenuItem key={index} value={msg}>
               {msg}
            </MenuItem>
         ));
      };

      this.showFile = () => {
         let temp = [];
         for (let i = 0; i < this.state.file.length; i++) {
            temp.push(<Box key={i}>{this.state.file[i].name}</Box>);
         }
         return temp;
      };

      this.getRoles = (id) => {
         let temp = id;
         this.state.roleList.map((role) => {
            if (role._id === id) {
               temp = role.role_name;
            }
            return null;
         });
         return temp;
      };

      this.onSubmit = () => {
         if (
            this.state.invoice_date === null ||
            this.state.file.length === 0 ||
            this.state.status === ''
         ) {
            alert('Some fields contain invalid value!');
         } else {
            this.setState({
               submitBtnDisable: true,
               progress: true,
            });
            const formData = new FormData();
            for (let i = 0; i < this.state.file.length; i++) {
               let file = this.state.file[i].name;
               let fileType = file.split('.');
               formData.append(
                  'file',
                  this.state.file[i],
                  'invoice_' +
                     new moment().format('DD_MM_YYYY_HH_m_s.') +
                     fileType[1]
               );
            }
            axios
               .post('/files', formData, {
                  headers: {
                     'content-type': 'multipart/form-data',
                  },
               })
               .then((file) => {
                  console.log('invoice called', file.data);
                  axios
                     .post('/request-details/invoice', {
                        _id: this.props.Purchase._id,
                        Invoice_Quantity: this.props.Purchase.Quantity,
                        Invoice_Measuring_Unit: this.props.Purchase
                           .Measuring_Unit,
                        Invoice_Amount: this.props.Purchase.Total_Price,
                        Invoice_Date: this.state.invoice_date,
                        Invoice_Document: file.data,
                        Id_Type: this.state.idType,
                        Id: this.state.Id,
                        Status: this.state.status,
                     })
                     .then((res) => {
                        console.log('add stock called');
                        axios
                           .post('/purchase-stocks/add', {
                              Purchase_List: this.props.Purchase._id,
                              Purchase_Id: this.props.Purchase._id,
                              Measuring_Unit: this.props.Purchase
                                 .Measuring_Unit,
                              Total_Quantity: this.props.Purchase.Quantity,
                           })
                           .then((stock) => {
                              console.log(
                                 'add production stock called:',
                                 stock
                              );
                              let temp = this.getRoles(
                                 this.props.Purchase.Created_By.Role_Id
                              );
                              console.log('role:', temp);
                              if (temp === 'Production Manager') {
                                 axios
                                    .post('/purchase-stocks/add-production', {
                                       _id: this.props.Purchase._id,
                                       Raw_Material_Id: this.props.Purchase
                                          .Raw_Material_Id,
                                       Raw_Material_Code: this.props.Purchase
                                          .Raw_Material_Code,
                                       Quantity: this.props.Purchase.Quantity,
                                       Measuring_Unit: this.props.Purchase
                                          .Measuring_Unit,
                                       Id: this.props.Purchase._id,
                                    })
                                    .then((response) => {
                                       console.log('response: ', response);
                                       this.setState({
                                          progress: false,
                                       });
                                       this.props.closeDialog('submit');
                                    })
                                    .catch((err) => {
                                       console.log('stock not reduced', err);
                                    });
                              } else {
                                 this.setState({
                                    progress: false,
                                 });
                                 this.props.closeDialog('submit');
                              }
                           })
                           .catch((err) => {
                              console.log('Stock not added', err);
                           });
                     })
                     .catch((err) => {
                        console.log('Invoice not added', err);
                     });
               })
               .catch((err) => {
                  console.log('File not added', err);
               });
         }
      };
   }

   componentDidMount() {
      axios.get('/measuring-unit').then((res) => {
         this.setState({
            unitList: [...res.data.MeasuringUnits],
         });
      });
      axios.get('/roles/roles').then((res) => {
         this.setState({
            roleList: [...res.data.Roles],
         });
      });
   }

   render() {
      return (
         <Box display='flex' flexDirection='column' alignItems='center'>
            <Box fontSize='30px' mb={3} fontWeight='bold'>
               Add to Stock
            </Box>
            {this.state.progress === true ? (
               <LinearProgress
                  color='primary'
                  variant='indeterminate'
                  style={{
                     marginLeft: '10px',
                     marginRight: '10px',
                     marginBottom: '10px',
                     width: '100%',
                  }}
               />
            ) : (
               <Box></Box>
            )}
            <Box style={styles.boxSize2}>
               <Box width='100%' style={style}>
                  <TextField
                     disabled
                     size='small'
                     fullWidth
                     variant='outlined'
                     label='Invoice_Quantity'
                     required
                     value={this.props.Purchase.Quantity}
                     onChange={(event) => {
                        this.setState({
                           invoice_quantity: event.target.value,
                        });
                     }}
                  ></TextField>
               </Box>
               <Box width='100%' style={style}>
                  <FormControl
                     required
                     variant='outlined'
                     fullWidth
                     size='small'
                  >
                     <InputLabel
                        style={{
                           backgroundColor: 'white',
                           paddingLeft: '2px',
                           paddingRight: '2px',
                        }}
                     >
                        Measuring Unit
                     </InputLabel>
                     <Select
                        disabled
                        name='Measuring_Unit'
                        variant='outlined'
                        required
                        value={this.props.Purchase.Measuring_Unit}
                        onChange={(event) => {
                           this.setState({
                              munit: event.target.value,
                           });
                           console.log(event.target.value);
                        }}
                     >
                        {this.state.unitList.map((measuring_unit, index) => {
                           return (
                              <MenuItem
                                 selected
                                 key={index}
                                 value={measuring_unit._id}
                              >
                                 {measuring_unit.measuring_unit_name}
                              </MenuItem>
                           );
                        })}
                     </Select>
                  </FormControl>
               </Box>
            </Box>
            <Box style={styles.boxSize2}>
               <Box width='100%' style={style}>
                  <TextField
                     disabled
                     size='small'
                     fullWidth
                     variant='outlined'
                     label='Invoice_Amount'
                     required
                     value={this.props.Purchase.Total_Price}
                     onChange={(event) => {
                        this.setState({
                           invoice_amount: event.target.value,
                        });
                     }}
                  ></TextField>
               </Box>
               <Box width='100%' style={style}>
                  <Datepick
                     id='1'
                     Name='Invoice_Date'
                     Req='true'
                     marginBottom={'10px'}
                     minDate='01/01/1990'
                     maxDate={new Date()}
                     value={this.state.invoice_date}
                     setDate={(date) => {
                        this.setState({
                           invoice_date: date,
                        });
                     }}
                  />
               </Box>
            </Box>
            <Box style={styles.boxSize2}>
               <Box width='100%' style={style}>
                  <FormControl
                     required
                     variant='outlined'
                     fullWidth
                     size='small'
                  >
                     <InputLabel
                        style={{
                           backgroundColor: 'white',
                           paddingLeft: '2px',
                           paddingRight: '2px',
                        }}
                     >
                        Status
                     </InputLabel>
                     <Select
                        variant='outlined'
                        required
                        value={this.state.status}
                        onChange={(event) => {
                           this.setState({
                              status: event.target.value,
                           });
                        }}
                     >
                        {this.loadStatus()}
                     </Select>
                  </FormControl>
               </Box>
               <Box width='100%' style={style}>
                  <FormControl
                     required
                     variant='outlined'
                     fullWidth
                     size='small'
                  >
                     <InputLabel
                        style={{
                           backgroundColor: 'white',
                           paddingLeft: '2px',
                           paddingRight: '2px',
                        }}
                     >
                        Id Type
                     </InputLabel>

                     <Select
                        variant='outlined'
                        required
                        value={this.state.idType}
                        onChange={(event) => {
                           this.setState({
                              idType: event.target.value,
                           });
                        }}
                     >
                        <MenuItem value='Box'>Box</MenuItem>
                        <MenuItem value='Individual'>Individual</MenuItem>
                     </Select>
                  </FormControl>
               </Box>
            </Box>
            <Box style={styles.boxSize2}>
               <Box
                  width='100%'
                  maxHeight='100px'
                  style={style}
                  flexDirection='row'
                  display='flex'
                  flexWrap='wrap'
                  overflow='auto'
               >
                  {this.state.Id.map((poc, index) => {
                     return (
                        <Box display='flex' width='33.33%' pt={1}>
                           <TextField
                              size='small'
                              fullWidth
                              variant='outlined'
                              label='Id'
                              required
                              name='Id'
                              value={this.state.Id[index].id}
                              onChange={(event) => {
                                 this.setState({
                                    a_id: event.target.value,
                                 });
                                 console.log(event.target.value);
                                 this.setState((prevState) => {
                                    prevState.Id[index].id = prevState.a_id;

                                    console.log('====', prevState.Id[index]);
                                 });
                              }}
                           ></TextField>

                           {this.state.Id.length === index + 1 ? (
                              <AddBoxOutlinedIcon
                                 color='secondary'
                                 style={{
                                    fontSize: '30px',
                                    margin: '4px',
                                    padding: '0px',
                                 }}
                                 onClick={() => {
                                    this.setState({});
                                    this.setState((prevState) => {
                                       prevState.Id.push({
                                          id: '',
                                       });
                                       console.log(prevState.Id);
                                    });
                                 }}
                              />
                           ) : (
                              <DeleteOutlineIcon
                                 color='secondary'
                                 style={{
                                    fontSize: '30px',
                                    padding: '0px',

                                    margin: '4px',
                                 }}
                                 onClick={() => {
                                    this.setState({});
                                    this.setState((prevState) => {
                                       prevState.Id.splice(index, 1);
                                       console.log(prevState.Id);
                                    });
                                 }}
                              />
                           )}
                        </Box>
                     );
                  }).reverse()}
               </Box>
            </Box>
            <Box style={styles.boxSize2}>
               <Box display={this.props.uploadFile} flexDirection='column'>
                  <input
                     style={{ display: 'none' }}
                     id='#file2'
                     type='file'
                     accept='image/*,application/pdf'
                     multiple='multiple'
                     onChange={(event) => {
                        let temp = event.target.files;
                        this.setState({
                           file: temp,
                        });
                        console.log('temp: ', temp);
                     }}
                  />
                  <label htmlFor='#file2'>
                     <Button
                        style={{ marginLeft: '10px' }}
                        variant='contained'
                        component='span'
                        color='default'
                        startIcon={<CloudUploadIcon />}
                     >
                        Upload Invoice
                     </Button>
                  </label>
                  <Box style={{ marginLeft: '10px', paddingTop: '5px' }}>
                     {this.showFile()}
                  </Box>
               </Box>
            </Box>
            <Box
               pt={2}
               pb={2}
               m={0}
               display='flex'
               justifyContent='flex-end'
               width='87%'
            >
               <Box display='flex'>
                  <Button
                     variant='contained'
                     color='primary'
                     size='large'
                     fontWeight='Bold'
                     onClick={() => {
                        this.props.closeDialog('cancel');
                     }}
                     style={{ fontWeight: 'bold' }}
                  >
                     Cancel
                  </Button>
               </Box>

               <Box marginLeft='10px'>
                  <Button
                     disabled={this.state.submitBtnDisable}
                     variant='contained'
                     color='primary'
                     size='large'
                     fontWeight='bold'
                     onClick={this.onSubmit}
                     style={{ fontWeight: 'bold' }}
                  >
                     Submit
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}

export default Add_Purchase_Stock;
