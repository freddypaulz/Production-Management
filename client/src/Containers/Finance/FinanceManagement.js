import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import Dashboard from '../../Components/Dashboard/Dashboard';
import auth from '../../Components/Auth/auth';
import AppBar from '../../Components/AppBar/AppBar';
import ManageFinance from './Finance/Manage_Finance';
import { Route } from 'react-router';

export default class FinanceManagement extends Component {
   constructor(props) {
      super(props);
      this.state = {
         width: '17vw',
         dashboardItems: []
      };
      this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
      this.contents = ['Manage Finance'];
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
               name='Finance'
               logout={this.logout}
               home={this.home}
               dashboardMax={this.dashboardMax}
               dashboardMin={this.dashboardMin}
            />
            <Box display='flex'>
               <Dashboard
                  items={this.state.dashboardItems}
                  componentName='home/finance'
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
                     path='/home/finance/manage-finance'
                     component={ManageFinance}
                  />
               </Box>
            </Box>
         </Box>
      );
   }
}
