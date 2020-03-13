import React, { Component } from 'react';
import {
   Box,
   TextField,
   Button,
   Select,
   FormControl,
   InputLabel,
   MenuItem,
   InputAdornment
} from '@material-ui/core';
// import PaperBoard from "../../Common_Files/PaperBoard/PaperBoard";
import axios from 'axios';
import Styles from '../styles/FormStyles';
import { Datepick } from '../../../Components/Date/Datepick';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const styles = Styles;
const style = {
   marginRight: '6px',
   marginLeft: '6px'
};
export default class AddSales extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         Product_Name: '',
         Product_ID: '',
         Quantity: '',
         Available_Stock: '',
         Balance_Stock: '',
         Measuring_Unit: '',
         Box_Id: [{ id: '' }],
         Selling_Date: null,
         Distributor: '',
         Payment_Type: '',
         Price: '',
         Final_Price: '',
         Discount: '',
         Advance: '',
         Balance: '',
         errors: [],
         openAdd: false,
         success: false,
         measuring_units: [],
         products: [],
         productstocks: [],
         code: '',
         b_id: '',
         distributors: [],
         DiscountValue: null
      };
      this.onAddHandler = () => {
         console.log('Ready to add');
         axios
            .post('/sales/add', {
               _id: this.state._id,
               Product_ID: this.state.Product_ID,
               Product_Name: this.state.Product_Name,
               Box_Id: this.state.Box_Id,
               Quantity: this.state.Quantity,
               Available_Stock: this.state.Available_Stock,
               Balance_Stock: this.state.Balance_Stock,
               Measuring_Unit: this.state.Measuring_Unit,
               Selling_Date: this.state.Selling_Date,
               Distributor: this.state.Distributor,
               Payment_Type: this.state.Payment_Type,
               Price: this.state.Price,
               Final_Price: this.state.Final_Price,
               Discount: this.state.Discount,
               Advance: this.state.Advance,
               Balance: this.state.Balance
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
      axios.get('/distributor').then(res => {
         console.log(res);
         this.setState({
            distributors: [...res.data.Distributors]
         });
         console.log('distributors : ', res.data.Distributors);
      });
      axios.get('/production-stock/stock').then(res => {
         console.log(res);
         this.setState({
            productstocks: [...res.data]
         });
         console.log('Production_Stock : ', res.data);
      });
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Sales
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
                                       let prodMeasur;
                                       let availablestock;
                                       this.state.productstocks.map(product => {
                                          if (
                                             product.Product_Name ===
                                             event.target.value
                                          ) {
                                             prodCode = product.Product_ID;
                                             prodMeasur =
                                                product.Measuring_Unit;
                                             availablestock = product.Quantity;
                                             console.log('Procode: ', prodCode);
                                             console.log(
                                                'product Name',
                                                product.Product_Name
                                             );
                                             console.log(
                                                ' Name',
                                                event.target.value
                                             );
                                          }
                                       });
                                       this.setState({
                                          Product_Name: event.target.value,
                                          Product_ID: prodCode,
                                          Measuring_Unit: prodMeasur,
                                          Available_Stock: availablestock
                                       });
                                       console.log(
                                          'product Name',
                                          this.state.Product_Name
                                       );
                                    }}
                                 >
                                    {this.state.productstocks.map(
                                       (stock, index) => {
                                          return (
                                             <MenuItem
                                                key={index}
                                                value={stock.Product_Name}
                                             >
                                                {this.state.products.map(
                                                   (product, index) => {
                                                      if (
                                                         stock.Product_Name ===
                                                         product._id
                                                      ) {
                                                         return product.product_name;
                                                      }
                                                   }
                                                )}
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
                           <Box width='50%' style={style}>
                              <TextField
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Available Stock'
                                 required
                                 name='Available_Stock'
                                 value={this.state.Available_Stock}
                                 onChange={event => {
                                    this.setState({
                                       Available_Stock: event.target.value
                                       //Balance: this.state.Final_Price - event.target.value
                                    });
                                    console.log(event.target.value);
                                 }}
                              ></TextField>
                           </Box>
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
                                    let prodprice;

                                    this.state.products.map(product => {
                                       console.log(
                                          'Pro: ',
                                          product.product_name
                                       );
                                       if (
                                          product._id ===
                                          this.state.Product_Name
                                       ) {
                                          prodprice = parseInt(
                                             product.product_price
                                          );
                                          console.log(
                                             'Procode123: ',
                                             product.product_price
                                          );
                                       }
                                    });
                                    this.setState({
                                       Quantity: event.target.value,
                                       Price: event.target.value * prodprice,
                                       Balance_Stock:
                                          this.state.Available_Stock -
                                          event.target.value
                                    });
                                 }}
                              ></TextField>
                           </Box>
                        </Box>

                        <Box style={styles.boxSize2}>
                           <Box width='50%' style={style}>
                              <TextField
                                 disabled
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Balance Stock'
                                 required
                                 name='Balance_Stock'
                                 value={this.state.Balance_Stock}
                                 // onChange={event => {
                                 //   this.setState({
                                 //     Balance_Stock: event.target.value
                                 //   });
                                 //   console.log(event.target.value);
                                 // }}
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
                                 </Select>
                              </FormControl>
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
                                    Distributor
                                 </InputLabel>
                                 <Select
                                    variant='outlined'
                                    required
                                    name='Distributor'
                                    value={this.state.Distributor}
                                    onChange={event => {
                                       this.setState({
                                          Distributor: event.target.value
                                       });
                                    }}
                                 >
                                    {this.state.distributors.map(
                                       (distributor, index) => {
                                          return (
                                             <MenuItem
                                                key={index}
                                                value={distributor._id}
                                             >
                                                {distributor.distributor_name}
                                             </MenuItem>
                                          );
                                       }
                                    )}
                                 </Select>
                              </FormControl>
                           </Box>
                        </Box>
                        <Box
                           style={styles.boxSize2}
                           overflow={true}
                           display='flex'
                        >
                           <Box
                              width='100%'
                              style={style}
                              flexDirection='row'
                              display='flex'
                              flexWrap='wrap'
                           >
                              {this.state.Box_Id.map((bid, index) => {
                                 return (
                                    <Box display='flex'>
                                       <TextField
                                          mb={4}
                                          size='small'
                                          fullWidth
                                          variant='outlined'
                                          label='Box_Id'
                                          required
                                          name='Box_Id'
                                          value={this.state.Box_Id[index].id}
                                          onChange={event => {
                                             this.setState({
                                                b_id: event.target.value
                                             });
                                             console.log(event.target.value);
                                             this.setState(prevState => {
                                                prevState.Box_Id[index].id =
                                                   prevState.b_id;

                                                console.log(
                                                   '====',
                                                   prevState.Box_Id[index]
                                                );
                                             });
                                          }}
                                       ></TextField>

                                       {this.state.Box_Id.length ===
                                       index + 1 ? (
                                          <AddBoxOutlinedIcon
                                             color='secondary'
                                             style={{
                                                fontSize: '30px',
                                                margin: '4px',
                                                padding: '0px'
                                             }}
                                             onClick={() => {
                                                this.setState({});
                                                this.setState(prevState => {
                                                   prevState.Box_Id.push({
                                                      id: ''
                                                   });
                                                   console.log(
                                                      prevState.Box_Id
                                                   );
                                                });
                                             }}
                                          />
                                       ) : (
                                          <DeleteOutlineIcon
                                             color='secondary'
                                             style={{
                                                fontSize: '29px',
                                                margin: '4px',
                                                padding: '0px'
                                             }}
                                             onClick={() => {
                                                this.setState({});
                                                this.setState(prevState => {
                                                   prevState.Box_Id.splice(
                                                      index,
                                                      1
                                                   );
                                                   console.log(
                                                      prevState.Box_Id
                                                   );
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
                           <Box width='100%' style={style}>
                              <Datepick
                                 id='4'
                                 variant='outlined'
                                 Name='Selling_Date'
                                 value={this.state.Selling_Date}
                                 setDate={date => {
                                    this.setState({
                                       Selling_Date: date
                                    });
                                    console.log(date);
                                 }}
                              />
                           </Box>
                        </Box>

                        <Box style={styles.boxSize2}>
                           <Box width='50%' style={style}>
                              <TextField
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Discount'
                                 required
                                 name='Discount'
                                 InputProps={{
                                    endAdornment: (
                                       <InputAdornment position='end'>
                                          %
                                       </InputAdornment>
                                    )
                                 }}
                                 value={this.state.Discount}
                                 onChange={event => {
                                    event.persist();
                                    this.setState({
                                       Discount: event.target.value
                                    });

                                    this.setState(prev => {
                                       prev.DiscountValue =
                                          prev.Price *
                                          (event.target.value / 100);
                                       prev.Final_Price =
                                          prev.Price - prev.DiscountValue;
                                       prev.Balance =
                                          prev.Final_Price - prev.Advance;
                                    });

                                    console.log(
                                       'discount',
                                       this.state.DiscountValue
                                    );
                                    console.log('price', this.state.Price);
                                 }}
                              ></TextField>
                           </Box>
                           <Box width='50%' style={style}>
                              <TextField
                                 disabled={true}
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Total Price'
                                 required
                                 name='Price'
                                 value={this.state.Price}
                                 // onChange={event => {
                                 //   this.setState({
                                 //     Price: event.target.value
                                 //   });
                                 //   //console.log(event.target.value);
                                 // }}
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
                                    Payment Type
                                 </InputLabel>
                                 <Select
                                    variant='outlined'
                                    required
                                    name='Payment_Type'
                                    value={this.state.Payment_Type}
                                    onChange={event => {
                                       this.setState({
                                          Payment_Type: event.target.value
                                       });
                                    }}
                                 >
                                    <MenuItem value='Payment Type' disabled>
                                       Payment Type
                                    </MenuItem>
                                    <MenuItem value='By Cash'>By Cash</MenuItem>
                                    <MenuItem value='By Cheque'>
                                       By Cheque
                                    </MenuItem>
                                    <MenuItem value='Debit'>Debit</MenuItem>
                                 </Select>
                              </FormControl>
                           </Box>
                           <Box width='50%' style={style}>
                              <TextField
                                 disabled
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Final_Price'
                                 required
                                 name='Final_Price'
                                 value={this.state.Final_Price}
                                 // onChange={event => {
                                 //   this.setState({
                                 //     Final_Price: event.target.value
                                 //   });
                                 //   console.log(event.target.value);
                                 // }}
                              ></TextField>
                           </Box>
                        </Box>
                        <Box style={styles.boxSize2}>
                           <Box width='50%' style={style}>
                              <TextField
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Advance Amount'
                                 required
                                 name='Advance'
                                 value={this.state.Advance}
                                 onChange={event => {
                                    this.setState({
                                       Advance: event.target.value,
                                       Balance:
                                          this.state.Final_Price -
                                          event.target.value
                                    });
                                    console.log(event.target.value);
                                 }}
                              ></TextField>
                           </Box>

                           <Box width='50%' style={style}>
                              <TextField
                                 disabled
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Balance Amount'
                                 required
                                 name='Balance'
                                 value={this.state.Balance}
                                 // onChange={event => {
                                 //   this.setState({
                                 //     Balance: event.target.value
                                 //   });
                                 //   console.log(event.target.value);
                                 // }}
                              ></TextField>
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
