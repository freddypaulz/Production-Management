import {
   Box,
   Button,
   FormControl,
   InputLabel,
   MenuItem,
   Select,
   Dialog,
   DialogContent,
   TextField,
   IconButton,
   DialogTitle,
   LinearProgress,
   InputAdornment,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import Axios from 'axios';
import React, { Component } from 'react';
import { Datepick } from '../../../../Components/Date/Datepick';
import { PaperBoard } from '../../../../Components/PaperBoard/PaperBoard';
import styles from '../../../../Components/styles/FormStyles';
import { PDFViewer } from '@react-pdf/renderer';
import { ReportPDF } from '../../../../Components/ReportPDF/ReportPDF';
import ReportCSV from '../../../../Components/ReportCSV/ReportCSV';
import moment from 'moment';
import CloseIcon from '@material-ui/icons/Close';

export default class Purchase extends Component {
   constructor(props) {
      super();

      this.state = {
         from_date: null,
         to_date: null,
         from_due_date: null,
         to_due_date: null,
         from_quantity: '',
         to_quantity: '',
         measuring_unit: '',
         raw_material_id: '',
         raw_material_code: '',
         status: '',
         vendor: '',
         currency_type: '',
         from_total_price: '',
         to_total_price: '',
         disabled: false,
         columns: [
            { title: 'Material Name', field: 'Raw_Material_Name' },
            { title: 'Quantity', field: 'Quantity' },
            { title: 'Vendor', field: 'Vendor' },
            { title: 'Total Price', field: 'Total_Price' },
            { title: 'Status', field: 'Status' },
         ],
         data: [],
         PDFData: [],
         raw_materials: [],
         vendors: [],
         measuring_units: [],
         openReport: false,
         openPDF: false,
         openCSV: false,
         dataReceived: false,
      };

      this.ref = React.createRef();
      this.onFilterHandler = () => {
         this.setState({
            dataReceived: false,
         });
         Axios.post('/request-details/request-details-filter', {
            from_date: this.state.from_date,
            to_date: this.state.to_date,
            from_due_date: this.state.from_due_date,
            to_due_date: this.state.to_due_date,
            from_quantity: this.state.from_quantity,
            to_quantity: this.state.to_quantity,
            measuring_unit: this.state.measuring_unit,
            raw_material_id: this.state.raw_material_id,
            vendor: this.state.vendor,
            raw_material_code: this.state.raw_material_code,
            status: this.state.status,
            from_total_price: this.state.from_total_price,
            to_total_price: this.state.to_total_price,
         }).then((res) => {
            console.log(res.data);
            res.data.map((record) => {
               console.log(record.Vendor);
               record.date = record.date.split('T');
               record.date = record.date[0].split('-').reverse().join('-');
               Axios.post('/raw-materials/raw-material', {
                  _id: record.Raw_Material_Id,
               }).then((RawMaterial) => {
                  console.log(RawMaterial);
                  record.Raw_Material_Name =
                     RawMaterial.data.RawMaterial[0].raw_material_name;
                  this.setState({
                     data: [...res.data],
                  });
                  Axios.post('/measuring-units/measuring-unit', {
                     _id: record.Measuring_Unit,
                  }).then((MeasuringUnit) => {
                     console.log(
                        'Hello----->>',
                        record.Measuring_Unit,
                        MeasuringUnit
                     );
                     if (
                        typeof MeasuringUnit.data.MeasuringUnit[0] !==
                        'undefined'
                     ) {
                        record.Measuring_Unit =
                           MeasuringUnit.data.MeasuringUnit[0].measuring_unit_name;
                     } else {
                        record.Measuring_Unit = 'Problem loading';
                     }
                     this.setState({
                        data: [...res.data],
                     });
                     Axios.post('/vendors/vendor', {
                        _id: record.Vendor,
                     }).then((vendor) => {
                        if (vendor.data.Vendor) {
                           console.log(vendor.data.Vendor[0].vendor_name);
                           record.Vendor = vendor.data.Vendor[0].vendor_name;
                        } else {
                           record.Vendor = 'not specified';
                        }
                        this.setState({
                           data: [...res.data],
                        });
                        Axios.post('/roles/role', {
                           _id: record.Created_By.Role_Id,
                        }).then((role) => {
                           if (role.data.Role[0]) {
                              record.Role = role.data.Role[0].role_name;
                           } else {
                              record.Role = 'not specified';
                           }
                           this.setState({
                              data: [...res.data],
                           });
                           if (
                              record.Created_By.Employee_Id !== 'not specified'
                           ) {
                              console.log(record.Created_By.Employee_Id);
                              Axios.post('/employees/employee', {
                                 _id: record.Created_By.Employee_Id,
                              }).then((employee) => {
                                 if (employee.data.Employee[0]) {
                                    console.log(
                                       employee.data.Employee[0]
                                          .employee_first_name
                                    );
                                    record.Employee =
                                       employee.data.Employee[0].employee_first_name;
                                 } else {
                                    record.Employee = 'not specified';
                                 }
                                 this.setState({
                                    data: [...res.data],
                                    dataReceived: true,
                                 });
                              });
                           } else {
                              record.Employee = 'not specified';
                              this.setState({
                                 dataReceived: true,
                              });
                           }
                        });
                     });
                  });
               });

               return null;
            });
            this.setState({
               data: [...res.data],
               openReport: true,
            });
            console.log(this.state.data);
         });
      };
   }
   componentDidMount() {
      this.setState({
         dataReceived: false,
      });
      Axios.get('/raw-materials/raw-materials').then((res) => {
         this.setState({
            raw_materials: [...res.data.RawMaterials],
         });
         Axios.get('/vendors/vendors').then((res) => {
            this.setState({
               vendors: [...res.data.Vendors],
            });
            Axios.get('/measuring-units/measuring-units').then((res) => {
               this.setState({
                  measuring_units: [...res.data.MeasuringUnits],
                  dataReceived: true,
               });
               Axios.post('/currency/currency', {
                  _id: '5eb2a1fcfcdc3a03f401855e',
               }).then((res) => {
                  this.setState({
                     currency_type: res.data.Currency[0].currency_type,
                  });
               });
            });
         });
      });
   }
   render() {
      return (
         <Box
            width='100%'
            display='flex'
            alignItems='center'
            flexDirection='column'
         >
            <Box fontSize='30px' mb={3}>
               Purchase Report
            </Box>
            <Box width='94.2%'>
               {!this.state.dataReceived ? <LinearProgress /> : null}
            </Box>
            <PaperBoard>
               <Box style={styles.box} alignContent='center'>
                  <Box style={styles.box_field}>
                     <Box style={styles.box} marginRight='10px'>
                        <Datepick
                           id='1'
                           Name='From Requested Date'
                           minDate={new Date('01-01-1990')}
                           maxDate={new Date()}
                           value={this.state.from_date}
                           setDate={(date) => {
                              date = date.startOf('day');
                              this.setState({
                                 from_date: date,
                                 disabled: true,
                              });
                           }}
                        />
                     </Box>
                     <Box style={styles.box}>
                        <Datepick
                           disabled={
                              this.state.from_date !== null ? false : true
                           }
                           id='2'
                           Name='To Requested Date'
                           minDate={this.state.from_date}
                           value={this.state.to_date}
                           setDate={(date) => {
                              date = date.endOf('day');
                              this.setState({
                                 to_date: date,
                                 disabled: false,
                              });
                           }}
                        />
                     </Box>
                  </Box>
                  <Box style={styles.box_field}>
                     <Box style={styles.box} marginRight='10px'>
                        <Datepick
                           id='1'
                           Name='From Due Date'
                           minDate={new Date('01-01-1990')}
                           value={this.state.from_due_date}
                           setDate={(date) => {
                              date = date.startOf('day');
                              this.setState({
                                 from_due_date: date,
                                 disabled: true,
                              });
                           }}
                        />
                     </Box>
                     <Box style={styles.box}>
                        <Datepick
                           disabled={
                              this.state.from_due_date !== null ? false : true
                           }
                           id='2'
                           Name='To Due Date'
                           minDate={this.state.from_due_date}
                           value={this.state.to_due_date}
                           setDate={(date) => {
                              date = date.endOf('day');
                              this.setState({
                                 to_due_date: date,
                                 disabled: false,
                              });
                           }}
                        />
                     </Box>
                  </Box>
                  <Box style={styles.box}>
                     <FormControl size='small' variant='outlined' fullWidth>
                        <InputLabel
                           style={{
                              backgroundColor: 'white',
                              paddingLeft: '2px',
                              paddingRight: '2px',
                           }}
                        >
                           Select Raw Material
                        </InputLabel>
                        <Select
                           style={styles.box_field}
                           value={this.state.raw_material_id}
                           onChange={(event) => {
                              this.setState({
                                 raw_material_id: event.target.value,
                              });
                           }}
                        >
                           {this.state.raw_materials.map(
                              (raw_material, index) => {
                                 return (
                                    <MenuItem
                                       key={index}
                                       selected
                                       value={raw_material._id}
                                    >
                                       {raw_material.raw_material_name}
                                    </MenuItem>
                                 );
                              }
                           )}
                        </Select>
                     </FormControl>
                  </Box>

                  <Box style={styles.box}>
                     <FormControl size='small' variant='outlined' fullWidth>
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
                           style={styles.box_field}
                           name='status'
                           fullWidth
                           variant='outlined'
                           value={this.state.status}
                           onChange={(event) => {
                              this.setState({
                                 status: event.target.value,
                              });
                           }}
                        >
                           <MenuItem value='Requesting'>Requesting</MenuItem>
                           <MenuItem value='Processing'>Processing</MenuItem>
                           <MenuItem value='ForwardedToAdmin'>
                              ForwardedToAdmin
                           </MenuItem>
                           <MenuItem value='ForwardedToFinance'>
                              ForwardedToFinance
                           </MenuItem>
                           <MenuItem value='Rejected'>Rejected</MenuItem>
                        </Select>
                     </FormControl>
                  </Box>

                  <Box style={styles.box}>
                     <FormControl size='small' variant='outlined' fullWidth>
                        <InputLabel
                           style={{
                              backgroundColor: 'white',
                              paddingLeft: '2px',
                              paddingRight: '2px',
                           }}
                        >
                           Select Vendors
                        </InputLabel>
                        <Select
                           style={styles.box_field}
                           value={this.state.vendor}
                           onChange={(event) => {
                              this.setState({
                                 vendor: event.target.value,
                              });
                           }}
                        >
                           {this.state.vendors.map((vendor, index) => {
                              return (
                                 <MenuItem
                                    key={index}
                                    selected
                                    value={vendor._id}
                                 >
                                    {vendor.vendor_name}
                                 </MenuItem>
                              );
                           })}
                        </Select>
                     </FormControl>
                  </Box>

                  <Box style={styles.box}>
                     <FormControl size='small' variant='outlined' fullWidth>
                        <InputLabel
                           style={{
                              backgroundColor: 'white',
                              paddingLeft: '2px',
                              paddingRight: '2px',
                           }}
                        >
                           Select Measuring Unit
                        </InputLabel>
                        <Select
                           style={styles.box_field}
                           value={this.state.measuring_unit}
                           onChange={(event) => {
                              this.setState({
                                 measuring_unit: event.target.value,
                              });
                           }}
                        >
                           {this.state.measuring_units.map(
                              (measuring_unit, index) => {
                                 return (
                                    <MenuItem
                                       key={index}
                                       selected
                                       value={measuring_unit._id}
                                    >
                                       {measuring_unit.measuring_unit_name}
                                    </MenuItem>
                                 );
                              }
                           )}
                        </Select>
                     </FormControl>
                  </Box>

                  <Box style={styles.box_field}>
                     <Box
                        style={styles.box}
                        marginRight='10px'
                        marginBottom='20px'
                     >
                        <TextField
                           size='small'
                           fullWidth
                           value={this.state.from_quantity}
                           variant='outlined'
                           label='From Quantity'
                           type='text'
                           onChange={(event) => {
                              this.setState({
                                 from_quantity: event.target.value,
                                 disabled: true,
                              });
                           }}
                        ></TextField>
                     </Box>
                     <Box style={styles.box}>
                        <TextField
                           disabled={
                              this.state.from_quantity === '' ? true : false
                           }
                           size='small'
                           fullWidth
                           value={this.state.to_quantity}
                           variant='outlined'
                           label='To Quantity'
                           type='text'
                           onChange={(event) => {
                              this.setState({
                                 to_quantity: event.target.value,
                              });
                              this.setState((prevState) => {
                                 if (
                                    parseFloat(prevState.to_quantity) >=
                                    parseFloat(prevState.from_quantity)
                                 ) {
                                    prevState.disabled = false;
                                 } else {
                                    prevState.disabled = true;
                                 }
                              });
                           }}
                           helperText='must be greater than From Quantity'
                        ></TextField>
                     </Box>
                  </Box>
               </Box>
               {/* {this.renderElement()} */}

               <Box style={styles.box_field}>
                  <Box
                     style={styles.box}
                     marginRight='10px'
                     marginBottom='20px'
                  >
                     <TextField
                        size='small'
                        fullWidth
                        value={this.state.from_total_price}
                        variant='outlined'
                        label='From Total Price'
                        type='text'
                        onChange={(event) => {
                           this.setState({
                              from_total_price: event.target.value,
                              disabled: true,
                           });
                        }}
                        InputProps={{
                           endAdornment: (
                              <InputAdornment position='start'>
                                 {this.state.currency_type}
                              </InputAdornment>
                           ),
                        }}
                     ></TextField>
                  </Box>
                  <Box style={styles.box}>
                     <TextField
                        disabled={
                           this.state.from_total_price === '' ? true : false
                        }
                        size='small'
                        fullWidth
                        value={this.state.to_total_price}
                        variant='outlined'
                        label='To Total Price'
                        type='text'
                        InputProps={{
                           endAdornment: (
                              <InputAdornment position='start'>
                                 {this.state.currency_type}
                              </InputAdornment>
                           ),
                        }}
                        onChange={(event) => {
                           this.setState({
                              to_total_price: event.target.value,
                           });
                           this.setState((prevState) => {
                              if (
                                 parseFloat(prevState.to_total_price) >=
                                 parseFloat(prevState.from_total_price)
                              ) {
                                 prevState.disabled = false;
                              } else {
                                 prevState.disabled = true;
                              }
                           });
                        }}
                        helperText='must be greater than from Total Price'
                     ></TextField>
                  </Box>
               </Box>
            </PaperBoard>
            <Box
               display=' flex'
               marginTop='20px'
               justifyContent='flex-end'
               width='94%'
            >
               <Box
                  display=' flex'
                  marginTop='20px'
                  justifyContent='flex-end'
                  width='94%'
               >
                  <Box marginRight='10px' width='100px'>
                     <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        size='large'
                        onClick={() => {
                           this.setState({
                              from_date: null,
                              to_date: null,
                              from_due_date: null,
                              to_due_date: null,
                              from_quantity: '',
                              to_quantity: '',
                              measuring_unit: '',
                              raw_material_id: '',
                              raw_material_code: '',
                              status: '',
                              vendor: '',
                              from_total_price: '',
                              to_total_price: '',
                              disabled: false,
                           });
                        }}
                     >
                        Clear
                     </Button>
                  </Box>
                  <Box width='100px'>
                     <Button
                        disabled={this.state.disabled}
                        fullWidth
                        variant='contained'
                        color='primary'
                        size='large'
                        onClick={this.onFilterHandler}
                     >
                        Report
                     </Button>
                  </Box>
               </Box>
               <Dialog maxWidth='lg' open={this.state.openReport} fullWidth>
                  <DialogContent ref={this.ref}>
                     <Box
                        fontSize='30px'
                        mb={3}
                        disabled='flex'
                        textAlign='center'
                     >
                        Purchase Report
                     </Box>

                     <Box style={styles.box}>
                        <Box width='95%'>
                           {!this.state.dataReceived ? (
                              <LinearProgress />
                           ) : null}
                        </Box>
                        <MaterialTable
                           title=''
                           style={{
                              width: '95%',
                              maxHeight: '500px',
                              overflow: 'auto',
                           }}
                           columns={this.state.columns}
                           data={this.state.data}
                           options={{
                              search: false,
                              draggable: false,
                              sorting: true,
                              headerStyle: {
                                 backgroundColor: '#3f51b5',
                                 color: '#FFF',
                              },
                              pageSize: this.state.data.length,
                           }}
                        />

                        <Box
                           width='95%'
                           display='flex'
                           justifyContent='flex-end'
                           marginTop='20px'
                        >
                           <Box marginRight='10px'>
                              <Button
                                 variant='contained'
                                 color='primary'
                                 size='large'
                                 onClick={() => {
                                    this.setState({
                                       openReport: false,
                                    });
                                 }}
                              >
                                 Close
                              </Button>
                           </Box>

                           <Box marginRight='10px'>
                              <Button
                                 disabled={!this.state.dataReceived}
                                 variant='contained'
                                 color='primary'
                                 size='large'
                                 onClick={() => {
                                    this.setState({
                                       openCSV: true,
                                    });
                                 }}
                              >
                                 Export CSV
                              </Button>
                           </Box>
                           <Box>
                              <Button
                                 disabled={!this.state.dataReceived}
                                 variant='contained'
                                 color='primary'
                                 size='large'
                                 onClick={() => {
                                    this.setState({
                                       openPDF: true,
                                       PDFData: [...this.state.data],
                                    });
                                 }}
                              >
                                 Export PDF
                              </Button>
                           </Box>
                        </Box>
                     </Box>
                  </DialogContent>
               </Dialog>
               <Dialog
                  onClose={() => {
                     this.setState({
                        openPDF: false,
                     });
                  }}
                  open={this.state.openPDF}
                  maxWidth='lg'
                  fullWidth
               >
                  <DialogTitle>
                     <Box
                        display='flex'
                        style={{
                           justifyContent: 'flex-end',
                        }}
                     >
                        <IconButton
                           size='small'
                           edge='end'
                           color='inherit'
                           onClick={() => {
                              this.setState({
                                 openPDF: false,
                              });
                           }}
                           aria-label='close'
                        >
                           <CloseIcon />
                        </IconButton>
                     </Box>
                  </DialogTitle>
                  <DialogContent>
                     <PDFViewer style={{ minHeight: '500px' }} width='100%'>
                        <ReportPDF
                           currency_type={this.state.currency_type}
                           data={this.state.PDFData}
                        />
                     </PDFViewer>
                  </DialogContent>
               </Dialog>
               <Dialog
                  onClose={() => {
                     this.setState({
                        openCSV: false,
                     });
                  }}
                  open={this.state.openCSV}
                  maxWidth='sm'
               >
                  <DialogTitle>
                     <Box
                        display='flex'
                        style={{
                           justifyContent: 'flex-end',
                        }}
                     >
                        <IconButton
                           size='small'
                           edge='end'
                           color='inherit'
                           onClick={() => {
                              this.setState({
                                 openCSV: false,
                              });
                           }}
                           aria-label='close'
                        >
                           <CloseIcon />
                        </IconButton>
                     </Box>
                  </DialogTitle>
                  <DialogContent>
                     <Box
                        marginTop='0px'
                        style={styles.box_field}
                        flexDirection='column'
                     >
                        <Box fontSize='30px' mb={3}>
                           Purchase Report CSV
                        </Box>
                        <ReportCSV
                           name={`Purchase Report ${new moment().format(
                              'DD/MM/YYYY HH:m:s'
                           )}.csv`}
                           data={this.state.data}
                           currency_type={this.state.currency_type}
                        />
                     </Box>
                  </DialogContent>
               </Dialog>
            </Box>
         </Box>
      );
   }
}
