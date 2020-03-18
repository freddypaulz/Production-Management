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
   DialogContent
} from '@material-ui/core';
import axios from 'axios';
import Styles from './styles/FormStyles';
import { Datepick } from '../../../Components/Date/Datepick';
import { Link as RefLink, Route } from 'react-router-dom';

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
         Raw_Material_Code: '',
         Quantity: '',
         Measuring_Unit: '',
         Priority: '',
         Due_Date: null,
         Status: '',
         Comments: 'no comments',
         Total_Price: '',
         Vendor: '',
         errors: [],
         success: false,
         measuring_units: [],
         materials: [],
         vendorList: [],
         vendorInfo: false,
         logComments: 'no comments',
         To: '',
         file: ''
      };

      this.openDialog = () => {
         this.setState({ openDialog: true });
      };

      this.closeDialog = () => {
         this.setState({ openDialog: false });
      };

      this.onEditHandler = () => {
         axios
            .post('/log/comment', {
               logs: {
                  reqId: props.Finance._id,
                  from: sessionStorage.getItem('Role ID'),
                  to: this.state.To,
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
                  Quotation_Document_URL: this.props.Finance
                     .Quotation_Document_URL
               });
            })
            .then(this.props.cancel())
            .catch(err => console.log(err));
      };

      this.vendorInfo = () => {
         let temp = [];
         this.state.vendorList.map((vendor, index) => {
            if (vendor._id === this.state.Vendor) {
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
               console.log('vendor not match');
            }
            return null
         });
         return temp;
      };

      this.loadFile = () => {
         var temp = [];
         this.props.Finance.Quotation_Document_URL.map((file, index) => {
            try {
               require(`../../../../build/uploads/${file}`);
               return temp.push(
                  <Box key={index}>
                     <RefLink
                        to='document'
                        target='_blank'
                        onClick={event => {
                           event.preventDefault();
                           window.open(
                              require(`../../../../build/uploads/${file}`)
                           );
                        }}
                        style={{ textDecoration: 'none', color: 'black' }}
                     >
                        {file}
                        {console.log('file:', file)}
                     </RefLink>
                     <Route
                        path='document'
                        component={require(`../../../../build/uploads/${file}`)}
                     />
                  </Box>
               );
            } catch (err) {
               console.log('File not found', err);
               return temp.push('File not found');
            }
            return null
         });
         return temp;
      };

      this.loadStatus = () => {
         let status = [
            'ForwardedToFinance',
            'Finance-Accepted',
            'Finance-Rejected',
            'ForwardedToAdmin',
            'ForwardedToPurchase'
         ];
         return status.map((msg, index) => (
            <MenuItem
               key={index}
               value={msg}
               disabled={msg === 'ForwardedToFinance'}
            >
               {msg}
            </MenuItem>
         ));
      };
   }

   componentDidMount() {
      axios.get('/raw-materials/raw-materials').then(res => {
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
            measuring_units: [...res.data.MeasuringUnits]
         });
      });

      this.setState({
         _id: this.props.Finance._id,
         Raw_Material_Id: this.props.Finance.Raw_Material_Id,
         Raw_Material_Code: this.props.Finance.Raw_Material_Code,
         Quantity: this.props.Finance.Quantity,
         Measuring_Unit: this.props.Finance.Measuring_Unit,
         Priority: this.props.Finance.Priority,
         Due_Date: this.props.Finance.Due_Date,
         Status: this.props.Finance.Status,
         Comments: this.state.Comments,
         Vendor: this.props.Finance.Vendor,
         Total_Price: this.props.Finance.Total_Price,
         Quotation_Document_URL: this.props.Finance.Quotation_Document_URL
      });
   }

   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
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
                                 name='Material_Code'
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
                                 name='Quantity'
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
                                    {this.state.measuring_units.map(
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
                                 disabled={this.props.disabled.vendor}
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Total_Price'
                                 required
                                 name='Total_Price'
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
                                    value={this.state.Priority}
                                    onChange={event => {
                                       this.setState({
                                          Priority: event.target.value
                                       });
                                    }}
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
                                       if (event.target.value === 'ForwardedToAdmin') {
                                          this.setState(prevState => {
                                             prevState.To = 'Admin'
                                          });
                                          console.log('if To state setted: ', this.state.To)
                                       } else if (event.target.value === 'ForwardedToPurchase'
                                          || event.target.value === 'Finance-Accepted'
                                          || event.target.value === 'Finance-Rejected'
                                       ) {
                                          this.setState(prevState => {
                                             prevState.To = 'Purchase'
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
                        <Box style={styles.boxSize2} ml={2}>
                           {this.loadFile()}
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
                  display={this.props.Finance.Vendor !== '' ? 'flex' : 'none'}
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
               </DialogContent>
            </Dialog>
         </Box >
      );
   }
}
