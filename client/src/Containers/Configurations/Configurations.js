import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import Dashboard from '../../Components/Dashboard/Dashboard';
import auth from '../../Components/Auth/auth';
import ProductCode from './ProductCode/ProductCode';
import { Route } from 'react-router-dom';
import AppBar from '../../Components/AppBar/AppBar';

export default class Configurations extends Component {
   constructor(props) {
      super(props);
      this.state = {
         width: '17vw',
         dashboardItems: []
      };
      this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
      this.contents = ['Product Code'];
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
               name='Configurations'
               logout={this.logout}
               home={this.home}
               dashboardMax={this.dashboardMax}
               dashboardMin={this.dashboardMin}
            />
            <Box display='flex'>
               <Dashboard
                  items={this.state.dashboardItems}
                  componentName='home/configurations'
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
                     path='/home/configurations/product-code'
                     component={ProductCode}
                  />
               </Box>
            </Box>
         </Box>
      );
   }
}
