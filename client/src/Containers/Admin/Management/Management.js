import React from 'react';
import { Box } from '@material-ui/core';
import Dashboard from '../../../Components/Dashboard/Dashboard';
import { Routes } from '../Routes/Routes';
import auth from '../../../Components/Auth/auth';
import AppBar from '../../../Components/AppBar/AppBar';
class Management extends React.Component {
   constructor(props) {
      super();
      this.state = {
         dashboardItems: [],
         width: '17vw'
      };

      this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
      this.contents = [
         'Manage Employees',
         'Manage Users',
         'Manage Roles',
         'Manage Products',
         'Manage Raw Materials',
         'Manage Vendors',
         'Manage Distributors',
         'Manage Countries',
         'Manage States',
         'Manage Cities',
         'Manage Work Locations',
         'Manage Shifts',
         'Manage Measuring Units',
         'Manage Material Types',
         'Manage Departments',
         'Manage Production Units',
         'Manage Designations',
         'Manage Boxes'
      ];
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
      //console.log(this.permissions);
      this.contents.map(content => {
         if (
            this.permissions.find(el => {
               return el === content ? true : false;
            })
         ) {
            //console.log('true: ', content);
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
      // console.log(this.state.dashboardItems, this.dashboardList);
   }
   render() {
      return (
         <Box>
            <AppBar
               name='Management'
               logout={this.logout}
               home={this.home}
               dashboardMax={this.dashboardMax}
               dashboardMin={this.dashboardMin}
            />
            <Box display='flex'>
               <Dashboard
                  items={this.state.dashboardItems}
                  componentName='home/management'
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
                  <Routes />
               </Box>
            </Box>
         </Box>
      );
   }
}

export default Management;
