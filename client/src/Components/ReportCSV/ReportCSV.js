import React, { Component } from 'react';
import { CSVLink } from 'react-csv';

export default class ReportCSV extends Component {
   constructor(props) {
      super(props);
      this.headers = [
         { label: 'Raw Material Name', key: 'Raw_Material_Name' },
         { label: 'Material Code', key: 'Raw_Material_Code' },
         { label: 'Quantity', key: 'Quantity' },
         { label: 'Unit', key: 'Measuring_Unit' },
         { label: 'Priority', key: 'Priority' },
         { label: 'Status', key: 'Status' },
         { label: 'Vendor', key: 'Vendor' },
         { label: 'Total Price', key: 'Total_Price' },
         { label: 'Created By', key: 'Employee' },
         { label: 'Designation', key: 'Role' },
         { label: 'Created Date', key: 'date' }
      ];
   }
   render() {
      return (
         <CSVLink
            filename={this.props.name}
            headers={this.headers}
            data={this.props.data}
            style={{
               textDecoration: 'none',
               backgroundColor: '#3f51b5',
               padding: '10px',
               color: 'white',
               borderRadius: '5px'
            }}
         >
            Click to download
         </CSVLink>
      );
   }
}
