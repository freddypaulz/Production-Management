import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Box, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import axios from 'axios';

export default class ManageProductStock extends Component {
   constructor(props) {
      super();
      this.EditData = {};
      this.state = {
         columns: [
            { title: 'Material Code', field: 'Raw_Material_Code' },
            { title: 'Material Name', field: 'Raw_Material_Id' },
            { title: 'Quantity', field: 'Total_Quantity' },
            { title: 'Measuring Unit', field: 'Measuring_Unit' }
         ],
         data: [],
         materialList: [],
         unitList: [],
         reqDetails: [],
         stockDetails: []
      };

      this.getMaterialDetails = (id, field) => {
         let temp = id;
         if (field === 'name') {
            this.state.materialList.map(material => {
               if (material._id === id) {
                  console.log('name called');
                  temp = material.raw_material_name;
               }
            });
         } else {
            this.state.materialList.map(material => {
               if (material._id === id) {
                  console.log('code called');
                  temp = material.raw_material_code;
               }
            });
         }
         return temp;
      };

      this.getUnit = id => {
         let temp = id;
         this.state.unitList.map(unit => {
            if (unit._id === id) {
               temp = unit.measuring_unit_name;
            }
         });
         return temp;
      };

      this.getDetails = (id, field) => {
         let temp = id;
         console.log('reqdetails:', this.state.reqDetails);
         this.state.reqDetails.map(details => {
            if (details._id === id) {
               temp = this.getMaterialDetails(details.Raw_Material_Id, field);
            }
         });
         return temp;
      };

      this.getFullDetails = id => {
         let temp = [];
         console.log('fulldetails called');
         this.state.reqDetails.map(details => {
            if (details._id === id) {
               temp = details;
            }
         });
         return temp;
      };

      this.loadDetails = () => {
         let temp = [];
         console.log('fulldetails: ', this.state.stockDetails);
         for (let i = 0; i < this.state.stockDetails[0].stock.length; i++) {
            this.state.stockDetails[0].stock[i].Purchase_List.map(id => {
               let str = this.getFullDetails(id);
               console.log(id);
               temp.push(str);
            });
         }
         this.setState({
            data: temp
         });
      };

      this.callDetails = () => {
         axios
            .get('/raw-material')
            .then(res => {
               this.setState({
                  materialList: [...res.data.RawMaterials]
               });
            })
            .catch(err => {
               console.log('cannot get materialList', err);
            });

         axios
            .get('/measuring-unit')
            .then(res => {
               this.setState({
                  unitList: [...res.data.MeasuringUnits]
               });
            })
            .catch(err => {
               console.log('cannot get unitList', err);
            });

         axios
            .get('/request-details')
            .then(res => {
               this.setState({
                  reqDetails: [...res.data]
               });
               axios.get('/purchase-stocks').then(res => {
                  let temp = [];
                  console.log('Stocks: ', res.data.stock);
                  for (let i = 0; i < res.data.stock.length; i++) {
                     res.data.stock[i].Raw_Material_Id = this.getDetails(
                        res.data.stock[i].Purchase_Id,
                        'name'
                     );
                     res.data.stock[i].Raw_Material_Code = this.getDetails(
                        res.data.stock[i].Purchase_Id,
                        'code'
                     );
                     res.data.stock[i].Measuring_Unit = this.getUnit(
                        res.data.stock[i].Measuring_Unit
                     );
                     console.log('rm: ', res.data.stock[i].Total_Quantity);
                     temp.push(res.data.stock[i]);
                  }
                  this.setState({
                     data: temp,
                     stockDetails: [res.data]
                  });
               });
            })
            .catch(err => {
               console.log('cannot get reqDetails', err);
            });
      };
   }
   componentDidMount() {
      this.callDetails();
   }
   render() {
      return (
         <Box
            width='100%'
            display='flex'
            alignItems='center'
            flexDirection='column'
         >
            <Box fontSize='30px' mb={8} fontWeight='bold '>
               Raw Material Stock Details
            </Box>
            <Box width='90%' display='flex' flexDirection='row'>
               <MaterialTable
                  title=' '
                  columns={this.state.columns}
                  data={this.state.data}
                  style={{
                     width: '100%',
                     overflow: 'auto',
                     alignItems: 'left'
                  }}
                  options={{
                     sorting: true,
                     headerStyle: {
                        backgroundColor: '#3f51b5',
                        color: '#FFF',
                        fontSize: 'medium',
                        fontWeight: 'bold'
                     }
                  }}
               />
            </Box>
         </Box>
      );
   }
}
