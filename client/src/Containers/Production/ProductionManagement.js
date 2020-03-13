import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import Dashboard from '../../Components/Dashboard/Dashboard';
import auth from '../../Components/Auth/auth';
import AppBar from '../../Components/AppBar/AppBar';
import { Route } from 'react-router';

import ManagePreProduction from './Production_Part/PreProduction/Manage_PreProduction';
import ManageProduction from './Production_Part/Production/Manage_Production';
import ManageRMRequest from './Production_Part/Raw_Material_Request/Manage_RM_Request';
import ManageWastage from './Production_Part/Wastage/Manage_Wastage';
import ManageUnitRequest from './Production_Part/Unit_Request/Manage_Unit_Request';
import ManageSales from './Sales_Part/Manage_Sale';

export default class ProductionManagement extends Component {
   constructor(props) {
      super(props);
      this.state = {
         width: '17vw',
         dashboardItems: []
      };
      this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
      this.contents = [
         'Manage PreProduction',
         'Manage Production',
         'Manage Quality Check',
         'Manage Wastage',
         'Manage Product Stock',
         'Manage Sales',
         'Manage Unit Request',
         'Manage Raw Material Request',
         'Manage Raw Material Stock',
         'Manage Unit'
      ];
      this.logout = () => {
         if (auth.logout()) {
            this.props.history.push('/');
         }
      };
      this.dashboardMin = () => {
         this.setState({
            width: '.1px'
         });
      };
      this.home = () => {
         this.props.history.push('/home');
      };
      this.dashboardMax = () => {
         this.setState({
            width: '17vw'
         });
      };
   }
   componentDidMount() {
      this.contents.map(content => {
         if (
            this.permissions.find(el => {
               return el === content ? true : false;
            })
         ) {
            let path = content.toLowerCase().replace(/ /g, '-');
            this.setState({});
            this.setState(prevState => {
               prevState.dashboardItems.push({
                  Name: content,
                  Path: path
               });
            });
         }
         return null;
      });
   }
   render() {
      return (
         <Box>
            <AppBar
               name='Production'
               logout={this.logout}
               home={this.home}
               dashboardMax={this.dashboardMax}
               dashboardMin={this.dashboardMin}
            />
            <Box display='flex'>
               <Dashboard
                  items={this.state.dashboardItems}
                  componentName='home/production'
                  width={this.state.width}
                  dashboardMin={this.dashboardMin}
               />
               <Box
                  display='flex'
                  flexDirection='column'
                  alignItems='center'
                  width='100%'
                  marginTop='10px'
               >
                  <Route
                     exact
                     path='/home/production/manage-preproduction'
                     component={ManagePreProduction}
                  />
                  <Route
                     exact
                     path='/home/production/manage-production'
                     component={ManageProduction}
                  />
                  <Route
                     exact
                     path='/home/production/manage-raw-material-request'
                     component={ManageRMRequest}
                  />
                  <Route
                     exact
                     path='/home/production/manage-wastage'
                     component={ManageWastage}
                  />
                  <Route
                     exact
                     path='/home/production/manage-unit-request'
                     component={ManageUnitRequest}
                  />
                  <Route
                     exact
                     path='/home/production/manage-sales'
                     component={ManageSales}
                  />
                  {/* <Route
                     exact
                     path='/home/production/product-qc'
                     component={ProductQC}
                  />
                  <Route path='/home/production/manage-qc' component={ManageQC} />

                  <Route
                     exact
                     path='/home/production/manage-product-stock'
                     component={ManageProductStock}
                  />
                  <Route
                     exact
                     path='/home/production/manage-rm-stock'
                     component={ManageRMStock}
                  />
                  <Route
                     exact
                     path='/home/production/production-unit'
                     component={ManageProductionUnit}
                  /> */}
               </Box>
            </Box>
         </Box>
      );
   }
}
