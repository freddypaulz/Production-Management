import React, { Component } from 'react';
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
import Styles from './styles/FormStyles';
import { Datepick } from '../../../Components/Date/Datepick';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Autocomplete from '@material-ui/lab/Autocomplete';

const styles = Styles;
const style = {
   marginRight: '6px',
   marginLeft: '6px',
};
export default class AddWastage extends Component {
   constructor(props) {
      super();
      this.state = {
         materialRecord: '',
         Raw_Material_Id: '',
         Quantity: '',
         raw_material_code: '',
         Id_Type: '',
         Id: [{ id: '' }],
         Measuring_Unit: '',
         Wastage_Date: null,
         Description: '',
         errors: [],
         openAdd: false,
         success: false,
         materials: [],
         measuring_units: [],
         reqDetails: [],
         stockDetails: [],
         a_id: '',
         submitBtnDisable: false,
         progress: false,
      };
      this.onAddHandler = () => {
         if (
            this.state.materialRecord !== null &&
            this.state.Raw_Material_Id !== '' &&
            this.state.Quantity !== '' &&
            this.state.raw_material_code !== '' &&
            this.state.Id_Type !== '' &&
            this.state.Id[0].id !== '' &&
            this.state.Wastage_Date !== null &&
            this.state.Description !== ''
         ) {
            this.setState({
               submitBtnDisable: true,
               progress: true,
            });
            axios
               .post('/purchase-wastages/add', {
                  // _id: this.state._id,
                  Raw_Material_Id: this.state.materialRecord._id,
                  Quantity: this.state.Quantity,
                  Product_ID: this.state.Product_ID,
                  Raw_Material_Code: this.state.materialRecord
                     .raw_material_code,
                  Id_Type: this.state.Id_Type,
                  Id: this.state.Id,
                  Measuring_Unit: this.state.materialRecord
                     .raw_material_measuring_unit,
                  Wastage_Date: this.state.Wastage_Date,
                  Description: this.state.Description,
               })
               .then((res) => {
                  console.log(res);
                  this.setState({
                     progress: false,
                  });
                  this.props.cancel();
               });
         } else {
            alert('Please check all the fields are entered properly');
         }
      };
   }
   componentDidMount() {
      axios.get('/raw-material').then((res) => {
         console.log(res);
         this.setState({
            materials: [...res.data.RawMaterials],
         });
      });

      axios.get('/measuring-unit').then((res) => {
         console.log(res.data.MeasuringUnits);
         this.setState({
            measuring_units: [...res.data.MeasuringUnits],
         });
      });

      axios.get('/request-details').then((res) => {
         console.log('reqDetails:', res.data);
         this.setState({
            reqDetails: [...res.data],
         });
      });

      axios.get('/purchase-stocks').then((res) => {
         console.log('stockDetails:', res.data.stock);
         this.setState({
            stockDetails: [...res.data.stock],
         });
      });
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Wastage
            </Box>
            <Box style={styles.root}>
               <Box display='flex' justifyContent='center'>
                  <Box style={styles.lbox}>
                     <Box style={styles.form}>
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
                           <Box width='50%' style={style}>
                              <FormControl
                                 required
                                 variant='outlined'
                                 fullWidth
                                 size='small'
                              >
                                 {/* <InputLabel
                                    style={{
                                       backgroundColor: 'white',
                                       paddingLeft: '2px',
                                       paddingRight: '2px',
                                    }}
                                 >
                                    Material Name
                                 </InputLabel>
                                 <Select
                                    variant='outlined'
                                    required
                                    name='Raw_Material_Id'
                                    value={this.state.Raw_Material_Id}
                                    onChange={(event) => {
                                       let materialCode;
                                       let Measuring;
                                       this.state.materials.map((material) => {
                                          if (
                                             material._id === event.target.value
                                          ) {
                                             materialCode =
                                                material.raw_material_code;
                                             Measuring =
                                                material.raw_material_measuring_unit;
                                             console.log(
                                                'code: ',
                                                materialCode
                                             );
                                          }
                                          return null;
                                       });
                                       this.setState({
                                          Raw_Material_Id: event.target.value,
                                          raw_material_code: materialCode,
                                          Measuring_Unit: Measuring,
                                       });
                                    }}
                                 >
                                    {this.state.stockDetails.map(
                                       (stockDetails, index) => {
                                          return this.state.reqDetails.map(
                                             (reqDetails) => {
                                                return this.state.materials.map(
                                                   (materials) => {
                                                      if (
                                                         stockDetails.Purchase_Id ===
                                                            reqDetails._id &&
                                                         stockDetails.Total_Quantity >
                                                            0
                                                      ) {
                                                         if (
                                                            reqDetails.Raw_Material_Id ===
                                                            materials._id
                                                         ) {
                                                            return (
                                                               <MenuItem
                                                                  key={index}
                                                                  value={
                                                                     materials._id
                                                                  }
                                                               >
                                                                  {
                                                                     materials.raw_material_name
                                                                  }
                                                               </MenuItem>
                                                            );
                                                         }
                                                      }
                                                      return null;
                                                   }
                                                );
                                             }
                                          );
                                       }
                                    )}
                                 </Select> */}
                                 <Autocomplete
                                    options={this.state.materials}
                                    autoHighlight={true}
                                    value={this.state.materialRecord}
                                    getOptionLabel={(option) =>
                                       option.raw_material_name
                                    }
                                    renderInput={(params) => (
                                       <TextField
                                          {...params}
                                          label='Raw Material'
                                          variant='outlined'
                                          size='small'
                                       />
                                    )}
                                    onChange={(event, value) => {
                                       console.log('materialRecord:', value);
                                       console.log(
                                          'stateRecord:',
                                          this.state.materialRecord
                                       );
                                       if (value !== null) {
                                          this.setState({
                                             materialRecord: value,
                                             Raw_Material_Id: value._id,
                                             raw_material_code:
                                                value.raw_material_code,
                                             Measuring_Unit:
                                                value.raw_material_measuring_unit,
                                          });
                                       }
                                    }}
                                 />
                              </FormControl>
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
                                 onChange={(event) => {
                                    this.setState({
                                       Quantity: event.target.value,
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
                                       paddingRight: '2px',
                                    }}
                                 >
                                    Id Type
                                 </InputLabel>
                                 <Select
                                    variant='outlined'
                                    required
                                    name='Id_Type'
                                    value={this.state.Id_Type}
                                    onChange={(event) => {
                                       this.setState({
                                          Id_Type: event.target.value,
                                       });
                                    }}
                                 >
                                    <MenuItem value='Id Type' disabled>
                                       Id Type
                                    </MenuItem>
                                    <MenuItem value='Individual'>
                                       Individual
                                    </MenuItem>
                                    <MenuItem value='Box'>Box</MenuItem>
                                 </Select>
                              </FormControl>
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
                                    value={this.state.Measuring_Unit}
                                    onChange={(event) => {
                                       this.setState({
                                          Measuring_Unit: event.target.value,
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
                                                prevState.Id[index].id =
                                                   prevState.a_id;

                                                console.log(
                                                   '====',
                                                   prevState.Id[index]
                                                );
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
                                                   prevState.Id.splice(
                                                      index,
                                                      1
                                                   );
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
                           <Box width='100%' style={style}>
                              <Datepick
                                 id='4'
                                 variant='outlined'
                                 Name='Wastage Date'
                                 value={this.state.Wastage_Date}
                                 setDate={(date) => {
                                    this.setState({
                                       Wastage_Date: date,
                                    });
                                    console.log(date);
                                 }}
                              />
                           </Box>
                        </Box>
                        <Box style={styles.boxSize2}>
                           <Box width='100%' style={style}>
                              <TextField
                                 multiline
                                 rowsMax='3'
                                 variant='outlined'
                                 fullWidth
                                 label='Reasons'
                                 size='small'
                                 value={this.state.Description}
                                 onChange={(event) => {
                                    this.setState({
                                       Description: event.target.value,
                                    });
                                    console.log(event.target.value);
                                 }}
                              ></TextField>
                           </Box>
                        </Box>
                     </Box>
                  </Box>
               </Box>
            </Box>
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
                     style={{ fontWeight: 'bold' }}
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
                     disabled={this.state.submitBtnDisable}
                     variant='contained'
                     color='primary'
                     style={{ fontWeight: 'bold' }}
                     size='large'
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
