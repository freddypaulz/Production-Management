import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import Dashboard from '../../Components/Dashboard/Dashboard';
import auth from '../../Components/Auth/auth';
import { Route } from 'react-router-dom';
import ManagePurchase from './Finance/ManagePurchases';
import AppBar from '../../Components/AppBar/AppBar';

export default class Requests extends Component {
   constructor(props) {
      super(props);
      this.state = {
         width: '17vw',
         dashboardItems: []
      };
      this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
      this.contents = ['Purchase Requests'];
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
               name='Requests'
               logout={this.logout}
               home={this.home}
               dashboardMax={this.dashboardMax}
               dashboardMin={this.dashboardMin}
            />
            <Box display='flex'>
               <Dashboard
                  items={this.state.dashboardItems}
                  componentName='home/requests'
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
                     path='/home/requests/purchase-requests'
                     component={ManagePurchase}
                  />
               </Box>
            </Box>
         </Box>
      );
   }
}
