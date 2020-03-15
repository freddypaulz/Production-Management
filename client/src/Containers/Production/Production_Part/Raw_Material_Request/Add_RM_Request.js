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
export default class AddRMRequest extends Component {
   constructor(props) {
      super();
      this.state = {
         _id: '',
         Raw_Material_Id: 'Raw_Material_Id',
         Raw_Material_Code: '',
         Quantity: '',
         Measuring_Unit: '',
         Priority: '',
         Due_Date: null,
         Status: 'Requesting',
         Comments: '-',
         errors: [],
         openAdd: false,
         success: false,
         measuring_units: [],
         materials: [],
         code: ''
      };
      this.onAddHandler = () => {
         console.log('Ready to add');
         axios
            .post('/request-details/add', {
               _id: this.state._id,
               Raw_Material_Id: this.state.Raw_Material_Id,
               Raw_Material_Code: this.state.Raw_Material_Code,
               Quantity: this.state.Quantity,
               Measuring_Unit: this.state.Measuring_Unit,
               Priority: this.state.Priority,
               Due_Date: this.state.Due_Date,
               Status: 'Requesting',
               Comments: this.state.Comments,
               logs: {
                  from: 'Production',
                  to: 'Purchase',
                  comments: this.state.Comments
               }
            })
            .then(res => {
               console.log(res);
               this.props.cancel();
            });
         console.log('added');
      };
   }
   componentDidMount() {
      axios.get('/measuring-units/measuring-units').then(res => {
         console.log(res);
         this.setState({
            measuring_units: [...res.data.MeasuringUnits]
         });
      });

      axios.get('/raw-materials/raw-materials').then(res => {
         console.log(res);
         this.setState({
            materials: [...res.data.RawMaterials]
         });
         // console.log("Product: ", this.state.products);
      });
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Add Raw Material Request
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
                                    Material Name
                                 </InputLabel>
                                 <Select
                                    variant='outlined'
                                    required
                                    name='Raw_Material_Id'
                                    value={this.state.Raw_Material_Id}
                                    onChange={event => {
                                       let materialCode;
                                       let Measuring;
                                       this.state.materials.map(material => {
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
                                          Raw_Material_Code: materialCode,
                                          Measuring_Unit: Measuring
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
                                 label='Material_Code'
                                 required
                                 name='Raw_Material_Code'
                                 value={this.state.Raw_Material_Code}
                                 onChange={event => {
                                    this.setState({
                                       Raw_Material_Code: event.target.value
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
                                 minDate={new Date()}
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
                              <TextField
                                 // disabled
                                 size='small'
                                 fullWidth
                                 variant='outlined'
                                 label='Status'
                                 required
                                 name='Status'
                                 value={this.state.Status}
                                 onChange={event => {
                                    this.setState({
                                       Status: event.target.value
                                    });
                                 }}
                              ></TextField>
                           </Box>
                        </Box>
                        <Box style={styles.boxSize2}>
                           <Box width='100%' style={style}>
                              <TextField
                                 multiline
                                 size='small'
                                 rowsMax='3'
                                 variant='outlined'
                                 fullWidth
                                 label='Comments'
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
