import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   Select,
   FormControl,
   InputLabel,
   MenuItem,
   Dialog,
   Link,
   DialogContent
} from '@material-ui/core';
import axios from 'axios';
import Styles from './styles/FormStyles';
import { Datepick } from '../../../Components/Date/Datepick';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Stock from './Add_Purchase_Stock';
import moment from 'moment';
const styles = Styles;
const style = {
   marginRight: '6px',
   marginLeft: '6px'
};
export default class EditPurchase extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         Raw_Material_Id: 'Raw_material_Id',
         Raw_Material_Code: null,
         Quantity: null,
         Measuring_Unit: '',
         Priority: '',
         Due_Date: null,
         Status: '',
         Comments: 'no comments',
         Total_Price: null,
         Vendor: '',
         errors: [],
         success: false,
         unitList: [],
         materials: [],
         vendorList: [],
         logComments: 'no comments',
         To: '',
         file: '',
         openDialog: false,
         vendorInfo: false
      };

      this.openDialog = () => {
         this.setState({ openDialog: true });
      };

      this.closeDialog = () => {
         this.setState({ openDialog: false });
      };

      this.onEditHandler = () => {
         if (
            this.state.Quantity !== null &&
            this.state.Vendor !== '' &&
            this.state.Total_Price !== null &&
            this.state.file.length !== 0 &&
            this.state.Measuring_Unit !== '' &&
            this.state.Status !== ''
         ) {
            const formData = new FormData();
            console.log('fileLength: ', this.state.file);
            for (let i = 0; i < this.state.file.length; i++) {
               let file = this.state.file[i].name;
               let fileType = file.split('.');
               formData.append(
                  'file',
                  this.state.file[i],
                  'quotation_' +
                     new moment().format('DD_MM_YYYY_HH_m_s') +
                     fileType[1]
               );
            }
            axios
               .post('/files', formData, {
                  headers: {
                     'content-type': 'multipart/form-data'
                  }
               })
               .then(res => {
                  console.log('file: ', res);
                  axios
                     .post('/log/comment', {
                        logs: {
                           reqId: props.Purchase._id,
                           from: sessionStorage.getItem('Role ID'),
                           to: 'Finance',
                           comments: this.state.Comments
                        }
                     })
                     .then(comments => {
                        console.log('Comments: ', comments);
                        axios.post('/request-details/edit', {
                           _id: this.state._id,
                           Raw_Material_Id: this.state.Raw_Material_Id,
                           Raw_Material_Code: this.state.Raw_Material_Code,
                           Quantity: this.state.Quantity,
                           Measuring_Unit: this.state.Measuring_Unit,
                           Priority: this.state.Priority,
                           Due_Date: this.state.Due_Date,
                           Status: this.state.Status,
                           Comments: this.state.Comments,
                           Vendor: this.state.Vendor,
                           Total_Price: this.state.Total_Price,
                           Quotation_Document_URL: res.data
                        });
                     })
                     .then(this.props.cancel());
               })
               .catch(err => console.log(err));
         } else {
            alert('please check all fields are entered properly');
         }
      };

      this.showFile = () => {
         let temp = [];
         for (let i = 0; i < this.state.file.length; i++) {
            temp.push(<Box key={i}>{this.state.file[i].name}</Box>);
         }
         return temp;
      };

      this.loadFile = () => {
         var temp = [];
         this.props.Purchase.Quotation_Document_URL.map((file, index) => {
            temp.push(
               <Box display='flex' key={index}>
                  <Link
                     // style={styles.link}
                     href={`/uploads/${file}`}
                     target='_blank'
                     rel='noreferrer'
                  >
                     {file}
                  </Link>
               </Box>
            );
            return null;
         });
         return temp;
      };

      this.loadStatus = () => {
         let status = [
            'Requesting',
            'Finance-Accepted',
            'Purchase-Completed',
            'ForwardedToFinance',
            'Purchase-Accepted',
            'Purchase-Rejected',
            'ForwardedToProduction'
         ];
         return status.map((msg, index) => (
            <MenuItem
               key={index}
               value={msg}
               disabled={
                  msg === 'Requesting' || msg === 'Finance-Accepted'
                     ? true
                     : false
               }
            >
               {msg}
            </MenuItem>
         ));
      };

      this.vendorInfo = () => {
         let temp = [];
         this.state.vendorList.map((vendor, index) => {
            if (vendor._id === this.state.Vendor) {
               console.log('matched');
               temp.push(
                  <Box key={index}>
                     <h4 style={{ padding: '0px', margin: '0px' }}>Vendor:</h4>
                     {`${vendor.vendor_name} - ${vendor.vendor_mobile_no} - ${vendor.vendor_email}`}{' '}
                     <br />
                     <h4 style={{ padding: '0px', margin: '0px' }}>
                        Point of contacts:
                     </h4>
                     {vendor.vendor_point_of_contact.map((poc, key) => (
                        <Box key={key}>
                           {poc.name +
                              ' ( ' +
                              poc.designation +
                              ' ) - ' +
                              poc.mobile_no}
                        </Box>
                     ))}
                  </Box>
               );
            } else {
               console.log('not match');
            }
            return null;
         });
         return temp;
      };
   }

   componentDidMount() {
      //console.log('Props: ', this.props.Purchase);
      axios.get('/raw-material').then(res => {
         console.log(res);
         this.setState({
            materials: [...res.data.RawMaterials]
         });
      });
      axios.get('/vendors/vendors').then(res => {
         console.log(res);
         this.setState({
            vendorList: [...res.data.Vendors]
         });
      });
      axios.get('/measuring-units/measuring-units').then(res => {
         console.log(res);
         this.setState({
            unitList: [...res.data.MeasuringUnits]
         });
      });

      this.setState({
         _id: this.props.Purchase._id,
         Raw_Material_Id: this.props.Purchase.Raw_Material_Id,
         Raw_Material_Code: this.props.Purchase.Raw_Material_Code,
         Quantity: this.props.Purchase.Quantity,
         Measuring_Unit: this.props.Purchase.Measuring_Unit,
         Priority: this.props.Purchase.Priority,
         Due_Date: this.props.Purchase.Due_Date,
         Status: this.props.Purchase.Status,
         Comments: this.state.Comments,
         Vendor: this.props.Purchase.Vendor,
         Total_Price: this.props.Purchase.Total_Price
      });
   }

   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3} fontWeight='bold'>
               Request Details
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
                  Successful
               </Box>
            ) : null}
            <Box style={styles.root}>
               <Box display='flex' justifyContent='center'>
                  <Box style={styles.lbox}>
                     <Box style={styles.form}>
                        <Box style={styles.boxSize2}>
                           <Box width='50%' style={style}>
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
                                       paddingRight: '2px'
                                    }}
                                 >
                                    Material Name
                                 </InputLabel>
                                 <Select
                                    disabled
                                    variant='outlined'
                                    required
                                    name='Raw_Material_Id'
                                    value={this.state.Raw_Material_Id}
                                    onChange={event => {
                                       let materialCode;
                                       this.state.materials.map(material => {
                                          if (
                                             material._id === event.target.value
                                          ) {
                                             materialCode =
                                                material.raw_material_code;
                                             console.log(
                                                'code: ',
                                                materialCode
                                             );
                                          }
                                          return null;
                                       });
                                       this.setState({
                                          Raw_Material_Id: event.target.value,
                                          Raw_Material_Code: materialCode
                                       });
                                    }}
                                 >
                                    {this.state.materials.map(
                                       (material, index) => {
                                          return (
                                             <MenuItem
                                                //selected
                                                key={index}
                                                value={material._id}
                                             >
                                                {material.raw_material_name}
                                             </MenuItem>
                                          );
                                       }
                                    )}
                                 </Select>
                              </FormControl>
                           </Box>
                           <Box width='50%' style={style}>
                              <TextField
                                 disabled
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Material_Code'
                                 required
                                 value={this.state.Raw_Material_Code}
                                 onChange={event => {
                                    this.setState({
                                       Material_Code: event.target.value
                                    });
                                    console.log(event.target.value);
                                 }}
                              ></TextField>
                           </Box>
                        </Box>
                        <Box style={styles.boxSize2}>
                           <Box width='50%' style={style}>
                              <TextField
                                 disabled={this.props.disabled.quantity}
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Quantity'
                                 required
                                 value={this.state.Quantity}
                                 onChange={event => {
                                    this.setState({
                                       Quantity: event.target.value
                                    });
                                 }}
                              ></TextField>
                           </Box>
                           <Box width='50%' style={style}>
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
                                       paddingRight: '2px'
                                    }}
                                 >
                                    Measuring Unit
                                 </InputLabel>
                                 <Select
                                    disabled={this.props.disabled.unit}
                                    name='Measuring_Unit'
                                    variant='outlined'
                                    required
                                    value={this.state.Measuring_Unit}
                                    onChange={event => {
                                       this.setState({
                                          Measuring_Unit: event.target.value
                                       });
                                       console.log(event.target.value);
                                    }}
                                 >
                                    {this.state.unitList.map(
                                       (measuring_unit, index) => {
                                          return (
                                             <MenuItem
                                                selected
                                                key={index}
                                                value={measuring_unit._id}
                                             >
                                                {
                                                   measuring_unit.measuring_unit_name
                                                }
                                             </MenuItem>
                                          );
                                       }
                                    )}
                                 </Select>
                              </FormControl>
                           </Box>
                        </Box>
                        <Box style={styles.boxSize2}>
                           <Box width='50%' style={style}>
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
                                       paddingRight: '2px'
                                    }}
                                 >
                                    Vendor Name
                                 </InputLabel>
                                 <Select
                                    disabled={this.props.disabled.vendor}
                                    variant='outlined'
                                    required
                                    name='Vendor'
                                    value={this.state.Vendor}
                                    onChange={event => {
                                       this.setState({
                                          Vendor: event.target.value
                                       });
                                    }}
                                 >
                                    {this.state.vendorList.map(
                                       (vendor, index) => {
                                          return (
                                             <MenuItem
                                                //selected
                                                key={index}
                                                value={vendor._id}
                                             >
                                                {vendor.vendor_name}
                                             </MenuItem>
                                          );
                                       }
                                    )}
                                 </Select>
                              </FormControl>
                           </Box>
                           <Box width='50%' style={style}>
                              <TextField
                                 disabled={this.props.disabled.amount}
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Total_Price'
                                 required
                                 value={this.state.Total_Price}
                                 onChange={event => {
                                    this.setState({
                                       Total_Price: event.target.value
                                    });
                                 }}
                              ></TextField>
                           </Box>
                        </Box>
                        <Box style={styles.boxSize2}>
                           <Box width='50%' style={style}>
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
                                       paddingRight: '2px'
                                    }}
                                 >
                                    Priority
                                 </InputLabel>
                                 <Select
                                    disabled
                                    variant='outlined'
                                    required
                                    name='Priority'
                                    value={this.props.Purchase.Priority}
                                 >
                                    <MenuItem value='Priority' disabled>
                                       Priority
                                    </MenuItem>
                                    <MenuItem value='Low'>Low</MenuItem>
                                    <MenuItem value='Medium'>Medium</MenuItem>
                                    <MenuItem value='High'>High</MenuItem>
                                 </Select>
                              </FormControl>
                           </Box>
                           <Box width='50%' style={style}>
                              <Datepick
                                 disabled={true}
                                 id='4'
                                 variant='outlined'
                                 Name='Due_Date'
                                 value={this.state.Due_Date}
                                 setDate={date => {
                                    this.setState({
                                       Due_Date: date
                                    });
                                    console.log(date);
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
                                       paddingRight: '2px'
                                    }}
                                 >
                                    Status
                                 </InputLabel>
                                 <Select
                                    disabled={this.props.disabled.status}
                                    variant='outlined'
                                    required
                                    name='Status'
                                    value={this.state.Status}
                                    onChange={event => {
                                       this.setState({
                                          Status: event.target.value
                                       });
                                       if (
                                          event.target.value ===
                                          'ForwardedToFinance'
                                       ) {
                                          this.setState(prevState => {
                                             prevState.To = 'Finance';
                                          });
                                       } else if (
                                          event.target.value ===
                                             'ForwardedToProduction' ||
                                          event.target.value ===
                                             'Purchase-Accepted' ||
                                          event.target.value ===
                                             'Purchase-Rejected'
                                       ) {
                                          this.setState(prevState => {
                                             prevState.To = 'Purchase';
                                          });
                                       }
                                    }}
                                 >
                                    {this.loadStatus()}
                                 </Select>
                              </FormControl>
                           </Box>
                           <Box
                              width='100%'
                              style={style}
                              display='flex'
                              flexDirection='column'
                           >
                              <TextField
                                 disabled={this.props.disabled.comment}
                                 size='small'
                                 multiline
                                 rowsMax='3'
                                 variant='outlined'
                                 fullWidth
                                 label='Comment'
                                 value={this.state.Comments}
                                 onChange={event => {
                                    this.setState({
                                       Comments: event.target.value
                                    });
                                    console.log(event.target.value);
                                 }}
                              ></TextField>
                           </Box>
                        </Box>
                        <Box style={styles.boxSize2}>
                           <Box width='100%' display='flex'>
                              <input
                                 style={{ display: 'none' }}
                                 accept='image/*,application/pdf'
                                 id='#file'
                                 type='file'
                                 multiple='multiple'
                                 onChange={event => {
                                    this.setState({
                                       file: event.target.files
                                    });
                                    console.log('temp: ', this.state.file);
                                 }}
                              />
                              <Box display='flex' flexDirection='column'>
                                 <label htmlFor='#file'>
                                    <Button
                                       style={{
                                          display: this.props.uploadFile,
                                          marginLeft: '10px'
                                       }}
                                       variant='contained'
                                       component='span'
                                       color='default'
                                       startIcon={<CloudUploadIcon />}
                                    >
                                       Upload Quotation
                                    </Button>
                                 </label>
                                 <Box
                                    style={{
                                       marginLeft: '10px',
                                       paddingTop: '5px'
                                    }}
                                 >
                                    {this.showFile()}
                                 </Box>
                              </Box>
                              <Box
                                 display={
                                    this.props.Purchase.Quotation_Document_URL
                                       .length > 0
                                       ? 'flex'
                                       : 'none'
                                 }
                                 marginLeft='10px'
                                 alignSelf='center'
                              >
                                 {this.loadFile()}
                              </Box>
                           </Box>
                        </Box>
                     </Box>
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
                        this.props.cancel();
                     }}
                     style={{ fontWeight: 'bold' }}
                  >
                     {this.props.disabled.btnText}
                  </Button>
               </Box>
               <Box
                  marginLeft='10px'
                  display={this.state.Vendor !== '' ? 'flex' : 'none'}
               >
                  <Button
                     variant='contained'
                     color='primary'
                     size='large'
                     fontWeight='bold'
                     onClick={() => {
                        this.setState({
                           vendorInfo: true
                        });
                        this.openDialog();
                     }}
                     style={{ fontWeight: 'bold' }}
                  >
                     Vendor Info
                  </Button>
               </Box>
               <Box
                  marginLeft='10px'
                  display={
                     this.props.Purchase.Status === 'Finance-Accepted'
                        ? 'flex'
                        : 'none'
                  }
               >
                  <Button
                     variant='contained'
                     color='primary'
                     size='large'
                     fontWeight='bold'
                     onClick={() => {
                        this.setState({
                           vendorInfo: false
                        });
                        this.openDialog();
                     }}
                     style={{ fontWeight: 'bold' }}
                  >
                     Add Stock
                  </Button>
               </Box>
               <Box marginLeft='10px' display={this.props.disabled.btnDisplay}>
                  <Button
                     variant='contained'
                     color='primary'
                     size='large'
                     fontWeight='bold'
                     onClick={this.onEditHandler}
                     style={{ fontWeight: 'bold' }}
                  >
                     Submit
                  </Button>
               </Box>
            </Box>
            <Dialog
               open={this.state.openDialog}
               onBackdropClick={() => {
                  return this.state.vendorInfo === true ? (
                     this.closeDialog()
                  ) : (
                     <Box></Box>
                  );
               }}
               maxWidth='sm'
               fullWidth
            >
               <DialogContent>
                  {this.state.vendorInfo === true ? (
                     <Box display='flex' flexDirection='column'>
                        <Box
                           fontSize='25px'
                           mb={3}
                           textAlign='center'
                           fontWeight='bold'
                        >
                           Vendor Information
                        </Box>
                        {this.vendorInfo()}
                     </Box>
                  ) : (
                     <Stock
                        Purchase={this.props.Purchase}
                        closeDialog={this.closeDialog}
                        upload={this.props.uploadFile}
                     />
                  )}
               </DialogContent>
            </Dialog>
         </Box>
      );
   }
}
