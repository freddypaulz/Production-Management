import React, { Component } from 'react';
import CSVReader from 'react-csv-reader';
import { Box, Button } from '@material-ui/core';
import axios from 'axios';

export default class StateCSVUpload extends Component {
   constructor(props) {
      super();
      this.state = {
         bulk_upload: []
      };
      this.onBulkAddHandler = () => {
         this.state.bulk_upload.map(state => {
            console.log(state[0]);
            axios
               .post('/countries/add-country', {
                  country_name: state[0],
                  description: state[1]
               })
               .then(res => {
                  console.log(res);
                  if (res.data.errors.length > 0) {
                     console.log(res.data.errors);
                     this.setState({
                        errors: [...res.data.errors],
                        success: false
                     });
                  }
               })
               .catch(err => {
                  console.log(err);
               });
            this.props.cancel();
            return null;
         });
      };
   }
   render() {
      return (
         <Box display='flex' flexDirection='column'>
            <Box fontSize='30px' fontWeight='bold'>
               Country CSV upload
            </Box>
            <Box display='flex'>
               <Box display='flex' flex='2' alignItems='center'>
                  <CSVReader
                     onFileLoaded={data => {
                        console.log(data);
                        let max = data.length - 2;
                        console.log(max);
                        data = data.splice(1, max);
                        this.setState({
                           bulk_upload: [...data]
                        });
                     }}
                  />
               </Box>

               <Box display='flex' alignSelf='flex-end' flex='1'>
                  <Button
                     style={{ marginRight: '10px' }}
                     variant='contained'
                     color='primary'
                     onClick={() => {
                        this.onBulkAddHandler();
                     }}
                  >
                     upload
                  </Button>
                  <Button
                     variant='contained'
                     color='primary'
                     onClick={() => {
                        this.props.cancel();
                     }}
                  >
                     cancel
                  </Button>
               </Box>
            </Box>
         </Box>
      );
   }
}
