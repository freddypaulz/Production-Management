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
// import PaperBoard from "../../../Common_Files/PaperBoard/PaperBoard";
import axios from 'axios';
import Styles from '../../styles/FormStyles';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const styles = Styles;
const style = {
   marginRight: '6px',
   marginLeft: '6px'
};
export default class AddPreProduction extends Component {
   constructor(props) {
      super();
      this.state = {
         Product_Name: '',
         Product_ID: '',
         Quantity: '',
         Measuring_Unit: '',
         Raw_Material_Details: [
            {
               material_name: '',
               material_code: '',
               measuring_unit: '',
               quantity: '',
               available_stock: ''
            }
         ],
         rmd_material_name: '',
         rmd_material_code: '',
         rmd_measuring_unit: '',
         rmd_quantity: ' ',
         rmd_available_stock: '',
         errors: [],
         openAdd: false,
         success: false,
         measuring_units: [],
         products: [],
         materials: [],
         rmstocks: [],
         code: ''
      };
      this.onAddHandler = () => {
         console.log('Ready to add');
         axios
            .post('/pre-production/add', {
               //_id: this.state._id,
               Product_ID: this.state.Product_ID,
               Product_Name: this.state.Product_Name,
               Quantity: this.state.Quantity,
               Measuring_Unit: this.state.Measuring_Unit,
               Raw_Material_Details: this.state.Raw_Material_Details
            })
            .then(res => {
               console.log(res);
               this.props.cancel();
            });
      };
      this.getUnit = id => {
         let temp = id;
         this.state.measuring_units.map(unit => {
            if (unit._id === id) {
               temp = unit.measuring_unit_name;
            }
         });
         return temp;
      };
   }
   componentDidMount() {
      axios.get('/production-raw-material-stock').then(res => {
         console.log(res);
         this.setState({
            rmstocks: [...res.data]
         });
         console.log(this.state.rmstocks);
      });
      axios.get('/measuring-units/measuring-units').then(res => {
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
      });
      axios.get('/raw-materials/raw-materials').then(res => {
         console.log(res);
         this.setState({
            materials: [...res.data.RawMaterials]
         });
      });
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               PreProduction Details
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
                                 </Select>
                              </FormControl>
                           </Box>
                        </Box>

                        <Box style={style} width='100%'>
                           <h4>Raw Material Required:</h4>
                        </Box>
                        <Box
                           display='flex'
                           flexWrap='wrap'
                           maxHeight='200px'
                           overflow='auto'
                           // border="1px solid #cfcccc"
                           padding='5px'
                           marginLeft='5px'
                           borderRadius='4px'
                           alignSelf='center'
                           style={style}
                        >
                           {this.state.Raw_Material_Details.map(
                              (poc, index) => {
                                 return (
                                    <Box style={styles.box_field}>
                                       <Box
                                          style={styles.box}
                                          marginRight='10px'
                                       >
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
                                                variant='outlined'
                                                required
                                                name='material_name'
                                                value={
                                                   this.state
                                                      .Raw_Material_Details[
                                                      index
                                                   ].material_name
                                                }
                                                onChange={event => {
                                                   let materialCode;
                                                   let Measuring;
                                                   let availablestock;
                                                   console.log(
                                                      this.state.rmstocks
                                                   );
                                                   this.state.rmstocks.map(
                                                      rmstock => {
                                                         if (
                                                            rmstock.Raw_Material_Id ===
                                                            event.target.value
                                                         ) {
                                                            materialCode =
                                                               rmstock.Raw_Material_Code;
                                                            Measuring =
                                                               rmstock.Measuring_Unit;
                                                            availablestock =
                                                               rmstock.Quantity;
                                                            console.log(
                                                               'code: ',
                                                               materialCode
                                                            );
                                                         }
                                                      }
                                                   );
                                                   this.setState({
                                                      rmd_material_name:
                                                         event.target.value,
                                                      rmd_material_code: materialCode,
                                                      rmd_measuring_unit: this.getUnit(
                                                         Measuring
                                                      ),
                                                      rmd_available_stock: availablestock,

                                                      Raw_Material_Details: [
                                                         {
                                                            material_code: materialCode,
                                                            measuring_unit: this.getUnit(
                                                               Measuring
                                                            ),
                                                            available_stock: availablestock
                                                         }
                                                      ]
                                                   });
                                                   this.setState(prevState => {
                                                      prevState.Raw_Material_Details[
                                                         index
                                                      ].material_name =
                                                         prevState.rmd_material_name;
                                                      console.log(
                                                         prevState
                                                            .Raw_Material_Details[
                                                            index
                                                         ]
                                                      );
                                                   });
                                                }}
                                             >
                                                {this.state.rmstocks.map(
                                                   (stock, index) => {
                                                      return (
                                                         <MenuItem
                                                            key={index}
                                                            value={
                                                               stock.Raw_Material_Id
                                                            }
                                                         >
                                                            {this.state.materials.map(
                                                               (
                                                                  material,
                                                                  index
                                                               ) => {
                                                                  if (
                                                                     stock.Raw_Material_Id ===
                                                                     material._id
                                                                  ) {
                                                                     return material.raw_material_name;
                                                                  }
                                                               }
                                                            )}
                                                         </MenuItem>
                                                      );
                                                   }
                                                )}
                                             </Select>
                                          </FormControl>
                                          {/* <FormControl
                            required
                            variant="outlined"
                            fullWidth
                            size="small"
                          >
                            <InputLabel
                              style={{
                                backgroundColor: "white",
                                paddingLeft: "2px",
                                paddingRight: "2px"
                              }}
                            >
                              Material Name
                            </InputLabel>
                            <Select
                              variant="outlined"
                              required
                              name="material_name"
                              value={this.state.material_name}
                              onChange={event => {
                                let materialCode;
                                let Measuring;
                                let availablestock;
                                this.state.rmstocks.map(material => {
                                  if (material._id === event.target.value) {
                                    materialCode = material.raw_material_code;
                                    Measuring =
                                      material.raw_material_measuring_unit;
                                    console.log("code: ", materialCode);
                                  }
                                });
                                this.setState({
                                  rmd_material_name: event.target.value,
                                  rmd_material_code: materialCode,
                                  rmd_measuring_unit: Measuring,
                                  Raw_Material_Details: [
                                    {
                                      material_code: materialCode,
                                      measuring_unit: this.getUnit(Measuring),
                                      available_stock: availablestock
                                    }
                                  ]
                                });
                                this.setState(prevState => {
                                  // (prevState.Raw_Material_Details[
                                  //   index
                                  // ].material_name = event.target.value),
                                  //   (prevState.Raw_Material_Details[
                                  //     index
                                  //   ].material_code = materialCode),
                                  prevState.Raw_Material_Details[
                                    index
                                  ].material_name = prevState.rmd_material_name;
                                  console.log(
                                    prevState.Raw_Material_Details[index]
                                  );
                                });
                              }}
                            >
                              {this.state.rmstocks.map((stock, index) => {
                                return (
                                  <MenuItem
                                    key={index}
                                    value={stock.Raw_Material_Id}
                                  >
                                    {this.state.materials.map(
                                      (material, index) => {
                                        if (
                                          stock.Raw_Material_Id === material._id
                                        ) {
                                          return material.raw_material_name;
                                        }
                                      }
                                    )}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl> */}
                                       </Box>
                                       <Box
                                          style={styles.box}
                                          marginRight='10px'
                                       >
                                          <TextField
                                             size='small'
                                             fullWidth
                                             required
                                             name='rmd_material_code'
                                             value={
                                                this.state.Raw_Material_Details[
                                                   index
                                                ].material_code
                                             }
                                             variant='outlined'
                                             label='Material Code'
                                             type='text'
                                             onChange={event => {
                                                this.setState({
                                                   rmd_material_code:
                                                      event.target.value
                                                });
                                                this.setState(prevState => {
                                                   prevState.Raw_Material_Details[
                                                      index
                                                   ].material_code =
                                                      prevState.rmd_material_code;
                                                   console.log(
                                                      prevState
                                                         .Raw_Material_Details[
                                                         index
                                                      ]
                                                   );
                                                });
                                             }}
                                          ></TextField>
                                       </Box>
                                       <Box
                                          style={styles.box}
                                          marginRight='10px'
                                       >
                                          <TextField
                                             size='small'
                                             fullWidth
                                             required
                                             value={
                                                this.state.Raw_Material_Details[
                                                   index
                                                ].available_stock
                                             }
                                             variant='outlined'
                                             label='Available Stock'
                                             type='text'
                                             onChange={event => {
                                                this.setState({
                                                   rmd_available_stock:
                                                      event.target.value
                                                });
                                                this.setState(prevState => {
                                                   prevState.Raw_Material_Details[
                                                      index
                                                   ].available_stock =
                                                      prevState.rmd_available_stock;
                                                   console.log(
                                                      prevState
                                                         .Raw_Material_Details[
                                                         index
                                                      ]
                                                   );
                                                });
                                             }}
                                          ></TextField>
                                       </Box>
                                       <Box
                                          style={styles.box}
                                          marginRight='10px'
                                       >
                                          <TextField
                                             size='small'
                                             fullWidth
                                             required
                                             value={
                                                this.state.Raw_Material_Details[
                                                   index
                                                ].quantity
                                             }
                                             variant='outlined'
                                             label='Quantity'
                                             type='text'
                                             onChange={event => {
                                                this.setState({
                                                   rmd_quantity:
                                                      event.target.value
                                                });
                                                this.setState(prevState => {
                                                   prevState.Raw_Material_Details[
                                                      index
                                                   ].quantity =
                                                      prevState.rmd_quantity;
                                                   console.log(
                                                      prevState
                                                         .Raw_Material_Details[
                                                         index
                                                      ]
                                                   );
                                                });
                                             }}
                                          ></TextField>
                                       </Box>
                                       <Box
                                          style={styles.box}
                                          marginRight='10px'
                                       >
                                          <TextField
                                             size='small'
                                             fullWidth
                                             required
                                             value={
                                                this.state.Raw_Material_Details[
                                                   index
                                                ].measuring_unit
                                             }
                                             variant='outlined'
                                             label='Measuring Unit'
                                             type='text'
                                             onChange={event => {
                                                this.setState({
                                                   rmd_measuring_unit:
                                                      event.target.value
                                                });
                                                this.setState(prevState => {
                                                   prevState.Raw_Material_Details[
                                                      index
                                                   ].measuring_unit =
                                                      prevState.rmd_measuring_unit;
                                                   console.log(
                                                      prevState
                                                         .Raw_Material_Details[
                                                         index
                                                      ]
                                                   );
                                                });
                                             }}
                                          ></TextField>
                                       </Box>
                                       {/* <Fab
                              variant='extended'
                              color='primary'
                              size='medium'
                           > */}
                                       {this.state.Raw_Material_Details
                                          .length ===
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
                                                   prevState.Raw_Material_Details.push(
                                                      {
                                                         material_name: '',
                                                         material_code: '',
                                                         measuring_unit: '',
                                                         quantity: ' ',
                                                         available_stock: ''
                                                      }
                                                   );
                                                   console.log(
                                                      prevState.Raw_Material_Details
                                                   );
                                                });
                                             }}
                                          />
                                       ) : (
                                          <DeleteOutlineIcon
                                             color='secondary'
                                             style={{
                                                fontSize: '30px',
                                                margin: '4px',
                                                padding: '0px'
                                             }}
                                             onClick={() => {
                                                this.setState({});
                                                this.setState(prevState => {
                                                   prevState.Raw_Material_Details.splice(
                                                      index,
                                                      1
                                                   );
                                                   console.log(
                                                      prevState.Raw_Material_Details
                                                   );
                                                });
                                             }}
                                          />
                                       )}

                                       {/* </Fab> */}
                                    </Box>
                                 );
                              }
                           ).reverse()}
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
