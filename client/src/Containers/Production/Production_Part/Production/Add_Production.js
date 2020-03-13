import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   Select,
   FormControl,
   InputLabel,
   MenuItem
} from '@material-ui/core';
import axios from 'axios';
import Styles from '../../styles/FormStyles';
import { Datepick } from '../../../../Components/Date/Datepick';

const styles = Styles;
const style = {
   marginRight: '6px',
   marginLeft: '6px'
};
export default class AddProduction extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         Product_Name: '',
         Product_ID: '',
         Batch_Id: '',
         Quantity: '',
         Measuring_Unit: '',
         Expiry_Duration_Days: '',
         Manufacture_Date: null,
         Status: 'Ready for QC',

         errors: [],
         openAdd: false,
         success: false,
         measuring_units: [],
         products: [],
         code: '',
         batchid: []
      };
      this.onAddHandler = () => {
         console.log('Ready to add');
         axios
            .post('/production/add', {
               //_id: this.state._id,
               Product_ID: this.state.Product_ID,
               Product_Name: this.state.Product_Name,
               Batch_Id: this.state.Batch_Id,
               Quantity: this.state.Quantity,
               Measuring_Unit: this.state.Measuring_Unit,
               Expiry_Duration_Days: this.state.Expiry_Duration_Days,
               Manufacture_Date: this.state.Manufacture_Date,
               Status: this.state.Status
            })
            .then(res => {
               console.log(res);
               this.props.cancel();
            });
      };
   }
   componentDidMount() {
      axios.get('/measuring-unit/measuring-units').then(res => {
         console.log(res);
         this.setState({
            measuring_units: [...res.data.MeasuringUnits]
         });
      });
      axios.get('/products/products').then(res => {
         console.log(res);
         this.setState({
            products: [...res.data.Products]
         });
         // console.log("Product: ", this.state.products);
      });
      axios.get('/production').then(res => {
         console.log('batchid', res.data);
         this.setState({
            batchid: res.data
         });

         // console.log("Product: ", this.state.products);
      });
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Production
            </Box>
            {/* {this.state.errors.length > 0 ? (
          this.state.errors.map((error, index) => {
            return (
              <Box style={styles.box_msg} bgcolor="#f73067" key={index}>
                {error}
              </Box>
            );
          })
        ) : this.state.success === true ? ( */}
            {/* <Box bgcolor="#3df45b" style={styles.box_msg}>
            Successful
          </Box> */}
            {/* ) : null} */}
            {/* <PaperBoard> */}
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
                                    Product Name
                                 </InputLabel>
                                 <Select
                                    variant='outlined'
                                    required
                                    name='Product_Name'
                                    value={this.state.Product_Name}
                                    onChange={event => {
                                       let prodCode;
                                       let prodUnit;
                                       this.state.products.map(product => {
                                          if (
                                             product._id === event.target.value
                                          ) {
                                             prodCode = product.product_code;
                                             prodUnit =
                                                product.product_measuring_unit;
                                             console.log('Procode: ', prodCode);
                                          }
                                       });
                                       this.setState({
                                          Product_Name: event.target.value,
                                          Product_ID: prodCode,
                                          Measuring_Unit: prodUnit
                                       });
                                    }}
                                 >
                                    {this.state.products.map(
                                       (product, index) => {
                                          return (
                                             <MenuItem
                                                //selected
                                                key={index}
                                                value={product._id}
                                             >
                                                {product.product_name}
                                             </MenuItem>
                                          );
                                       }
                                    )}
                                    {/* <MenuItem value="Product Name" disabled>
                            Product Name
                          </MenuItem>
                          <MenuItem value="Orange Juice">Orange Juice</MenuItem>
                          <MenuItem value="Apple Juice">Apple Juice</MenuItem> */}
                                 </Select>
                              </FormControl>
                           </Box>
                           <Box width='50%' style={style}>
                              <TextField
                                 disabled
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Product_ID'
                                 required
                                 name='Product_ID'
                                 value={this.state.Product_ID}
                                 onChange={event => {
                                    this.setState({
                                       Product_ID: event.target.value
                                    });

                                    console.log(event.target.value);
                                 }}
                              ></TextField>
                           </Box>
                        </Box>
                        <Box style={styles.boxSize2}>
                           <Box width='100%' style={style}>
                              <TextField
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Batch_Id'
                                 required
                                 name='Batch_Id'
                                 value={this.state.Batch_Id}
                                 onChange={event => {
                                    this.setState({
                                       Batch_Id: event.target.value
                                    });
                                    this.state.batchid.map(batchid => {
                                       console.log(
                                          'res.batchid',
                                          batchid.Batch_Id
                                       );
                                       console.log(
                                          'state.batchid',
                                          this.state.Batch_Id
                                       );
                                       if (
                                          event.target.value ===
                                          batchid.Batch_Id
                                       ) {
                                          alert('Batch Id Already Exist');
                                       }
                                    });
                                    console.log(event.target.value);
                                 }}
                              ></TextField>
                           </Box>
                        </Box>
                        <Box style={styles.boxSize2}>
                           <Box width='50%' style={style}>
                              <TextField
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
                                    disabled
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
                                    {/* <MenuItem value="Product Name" disabled>
                          ltr
                        </MenuItem>
                        <MenuItem value="Orange Juice">kg</MenuItem>
                        <MenuItem value="Apple Juice">Apple Juice</MenuItem> */}
                                 </Select>
                              </FormControl>
                           </Box>
                        </Box>

                        <Box style={styles.boxSize2}>
                           <Box width='50%' style={style}>
                              <TextField
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Expiry_Duration_Days'
                                 required
                                 name='Expiry_Duration_Days'
                                 value={this.state.Expiry_Duration_Days}
                                 onChange={event => {
                                    this.setState({
                                       Expiry_Duration_Days: event.target.value
                                    });
                                    console.log(event.target.value);
                                 }}
                              ></TextField>
                           </Box>
                           <Box width='50%' style={style}>
                              <Datepick
                                 id='4'
                                 variant='outlined'
                                 Name='Manufacture_Date'
                                 value={this.state.Manufacture_Date}
                                 setDate={date => {
                                    this.setState({
                                       Manufacture_Date: date
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
                                    name='Measuring_Unit'
                                    variant='outlined'
                                    required
                                    value={this.state.Status}
                                    onChange={event => {
                                       this.setState({
                                          Status: event.target.value
                                       });
                                       console.log(event.target.value);
                                    }}
                                 >
                                    <MenuItem
                                       value='Status '
                                       disabled
                                    ></MenuItem>
                                    <MenuItem value='Ready to Product QC'>
                                       Ready to Product QC
                                    </MenuItem>
                                    <MenuItem value='Ready to Packing QC'>
                                       Ready to Packing QC
                                    </MenuItem>
                                    <MenuItem value='Ready For QC'>
                                       Ready For QC
                                    </MenuItem>
                                 </Select>
                              </FormControl>
                           </Box>
                        </Box>
                     </Box>
                  </Box>
               </Box>
            </Box>
            {/* </PaperBoard> */}
            <Box
               display=' flex'
               pt={2}
               pb={2}
               m={0}
               justifyContent='flex-end'
               width='87%'
            >
               <Box display=' flex'>
                  <Button
                     fullWidth
                     variant='contained'
                     color='primary'
                     size='large'
                     fontWeight='Bold'
                     onClick={() => {
                        this.props.cancel();
                     }}
                  >
                     Cancel
                  </Button>
               </Box>
               <Box marginLeft='10px'>
                  <Button
                     fullWidth
                     variant='contained'
                     color='primary'
                     size='large'
                     fontSize='20px'
                     onClick={() => {
                        this.onAddHandler();
                     }}
                  >
                     Submit
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
