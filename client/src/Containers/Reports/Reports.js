import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import Dashboard from '../../Components/Dashboard/Dashboard';
import auth from '../../Components/Auth/auth';
import Purchase from './Purchase/Purchase';
import ProductionAndSales from './ProductionAndSales/ProductionAndSales';
import { Route } from 'react-router-dom';
import AppBar from '../../Components/AppBar/AppBar';

export default class Reports extends Component {
   constructor(props) {
      super(props);
      this.state = {
         width: '17vw',
         dashboardItems: []
      };
      this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
      this.contents = ['Purchase Report', 'Production and Sales Report'];
      this.logout = () => {
         if (auth.logout()) {
            this.props.history.push('/');
         }
      };
      this.home = () => {
         this.props.history.push('/home');
      };
      this.dashboardMin = () => {
         this.setState({
            width: '.1px'
         });
      };
      this.dashboardMax = () => {
         this.setState({
            width: '17vw'
         });
      };
   }

   componentDidMount() {
      console.log(this.permissions);
      this.contents.map(content => {
         if (
            this.permissions.find(el => {
               return el === content ? true : false;
            })
         ) {
            //console.log('true: ', master);
            let path = content.toLowerCase().replace(/ /g, '-');
            //console.log(path);
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
               name='Reports'
               logout={this.logout}
               home={this.home}
               dashboardMax={this.dashboardMax}
               dashboardMin={this.dashboardMin}
            />
            <Box display='flex'>
               <Dashboard
                  items={this.state.dashboardItems}
                  componentName='home/reports'
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
                     path='/home/reports/purchase-report'
                     component={Purchase}
                  />
                  <Route
                     exact
                     path='/home/reports/production-and-sales-report'
                     component={ProductionAndSales}
                  />
               </Box>
            </Box>
         </Box>
      );
   }
}
