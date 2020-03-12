import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   Select,
   FormControl,
   InputLabel,
   MenuItem,
   Link,
   Dialog,
   DialogContent
} from '@material-ui/core';
import axios from 'axios';
import Styles from './styles/FormStyles';
import { Datepick } from '../../../Components/Date/Datepick';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import Logs from '../Logs/Logs';

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
         Raw_Material_Id: '',
         Raw_Material_Code: '',
         Quantity: '',
         Measuring_Unit: '',
         Priority: '',
         Due_Date: null,
         Status: '',
         Comments: '',
         Total_Price: '',
         Vendor: '',
         errors: [],
         success: false,
         measuring_units: [],
         materials: [],
         vendors: [],
         code: '',
         to: '',
         quotation: '',
         openLog: false,
         logs: []
      };
      this.onEditHandler = () => {
         axios
            .post('/logs/comment', {
               logs: {
                  reqId: props.Purchase._id,
                  from: 'Admin',
                  to: this.state.to,
                  comments: this.state.Comments
               }
            })
            .then(comments => {
               console.log('Comments: ', comments);
               axios
                  .post('/request-details/edit', {
                     _id: this.state._id,
                     Raw_Material_Id: this.state.Raw_Material_Id,
                     Raw_Material_Code: this.state.Raw_Material_Code,
                     Quantity: this.state.Quantity,
                     Measuring_Unit: this.state.Measuring_Unit,
                     Quotation_Document_URL: [],
                     Priority: this.state.Priority,
                     Due_Date: this.state.Due_Date,
                     Status: this.state.Status,
                     Comments: comments.data.Comments,
                     Vendor: this.state.Vendor,
                     Total_Price: this.state.Total_Price
                  })
                  .then(res => {
                     console.log(res.data);
                  });
            })
            .catch(err => console.log(err));
         this.props.cancel();
      };

      this.loadStatus = () => {
         let status = ['ForwardedToPurchase', 'ForwardedToFinance', 'Rejected'];
         return status.map((msg, index) => (
            <MenuItem key={index} value={msg}>
               {msg}
            </MenuItem>
         ));
      };
   }

   componentDidMount() {
      console.log('Props: ', this.props.Purchase);
      axios.get('/raw-materials/raw-materials').then(res => {
         console.log(res);
         this.setState(prevState => {
            prevState.materials = [...res.data.RawMaterials];
         });
         this.setState({
            Raw_Material_Id: this.props.Purchase.Raw_Material_Id,
            Raw_Material_Code: this.props.Purchase.Raw_Material_Code
         });
      });
      axios.get('/vendors/vendors').then(res => {
         console.log(res);
         this.setState(prevState => {
            prevState.vendors = [...res.data.Vendors];
         });
         this.setState({
            Vendor: this.props.Purchase.Vendor
         });
      });
      axios.get('/measuring-units/measuring-units').then(res => {
         console.log(res);
         this.setState(prevState => {
            prevState.measuring_units = [...res.data.MeasuringUnits];
         });
         this.setState({
            Measuring_Unit: this.props.Purchase.Measuring_Unit
         });
      });
      console.log('Props: ', this.props.Purchase._id);
      this.setState({
         _id: this.props.Purchase._id,
         Quantity: this.props.Purchase.Quantity,
         Priority: this.props.Purchase.Priority,
         Due_Date: this.props.Purchase.Due_Date,
         Comments: this.props.Purchase.Comments,
         Total_Price: this.props.Purchase.Total_Price,
         quotation: this.props.Purchase.Quotation_Document_URL
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
                                    {this.state.vendors.map((vendor, index) => {
                                       return (
                                          <MenuItem
                                             //selected
                                             key={index}
                                             value={vendor._id}
                                          >
                                             {vendor.vendor_name}
                                          </MenuItem>
                                       );
                                    })}
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
                                 minDate={new Date()}
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
                                          this.setState(pre => {
                                             pre.to = 'Finance';
                                          });
                                       } else if (
                                          event.target.value ===
                                          'ForwardedToPurchase'
                                       ) {
                                          this.setState(pre => {
                                             pre.to = 'Purchase';
                                          });
                                       } else {
                                          this.setState(pre => {
                                             pre.to = 'Rejected';
                                          });
                                       }

                                       console.log(this.state.to);
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
                              justifyContent='space-between'
                           >
                              <Box display='flex' width='85%'>
                                 <TextField
                                    disabled={this.props.disabled.comment}
                                    size='small'
                                    multiline
                                    rowsMax='3'
                                    variant='outlined'
                                    fullWidth
                                    label='Comments'
                                    value={this.state.Comments}
                                    onChange={event => {
                                       this.setState({
                                          Comments: event.target.value
                                       });
                                    }}
                                 />
                              </Box>
                              <Box display='flex'>
                                 <Button
                                    variant='outlined'
                                    color='secondary'
                                    size='small'
                                    fontWeight='Bold'
                                    onClick={() => {
                                       axios
                                          .post('/logs/logs', {
                                             Request_Id: this.state._id
                                          })
                                          .then(Logs => {
                                             console.log(Logs.data);
                                             this.setState({
                                                logs: Logs.data
                                             });
                                             this.setState({
                                                openLog: true
                                             });
                                          });
                                    }}
                                 >
                                    <DescriptionOutlinedIcon />
                                 </Button>
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
               justifyContent='space-between'
               width='88%'
            >
               <Box display='flex'>
                  <Link
                     style={styles.link}
                     href={this.state.quotation}
                     target='_blank'
                     rel='noreferrer'
                  >
                     <GetAppOutlinedIcon color='secondary' />
                     Quotation
                  </Link>
               </Box>
               <Box display='flex'>
                  <Box>
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
                  <Box marginLeft='10px'>
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
                  <Dialog open={this.state.openLog} maxWidth='lg' fullWidth>
                     <DialogContent>
                        <Logs
                           data={this.state.logs}
                           cancel={() => {
                              this.setState({
                                 openLog: false
                              });
                              this.handleClose();
                           }}
                        />
                        <Box
                           width='95%'
                           display='flex'
                           justifyContent='flex-end'
                           marginTop='20px'
                        >
                           <Button
                              variant='contained'
                              color='primary'
                              size='large'
                              onClick={() => {
                                 this.setState({
                                    openLog: false
                                 });
                              }}
                           >
                              Close
                           </Button>
                        </Box>
                     </DialogContent>
                  </Dialog>
               </Box>
            </Box>
         </Box>
      );
   }
}
