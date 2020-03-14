import React, { Component } from 'react';
import CSVReader from 'react-csv-reader';
import { Box, Button } from '@material-ui/core';
import axios from 'axios';

export default class CityCSVUpload extends Component {
   constructor(props) {
      super();
      this.state = {
         bulk_upload: []
      };
      this.onBulkAddHandler = () => {
         this.state.bulk_upload.map(city => {
            axios
               .post('/states/state-name', { state_name: city[1] })
               .then(State => {
                  axios
                     .post('/cities/add-city', {
                        city_name: city[0],
                        state_id: State.data.State[0]._id,
                        description: city[2]
                     })
                     .then(res => {
                        if (res.data.errors.length > 0) {
                           console.log(res.data.errors);
                           this.setState({
                              errors: [...res.data.errors],
                              success: false
                           });
                        }
                     })
                     .catch(err => console.log(err));
               })
               .catch(err => {
                  console.log(err);
                  this.props.cancel();
               });
            return null;
         });
      };
   }
   render() {
      return (
         <Box display='flex' flexDirection='column'>
            <Box fontSize='30px' fontWeight='bold'>
               City CSV upload
            </Box>
            <Box display='flex'>
               <Box display='flex' flex='2' alignItems='center'>
                  <CSVReader
                     onFileLoaded={data => {
                        let max = data.length - 2;
                        data = data.splice(1, max);
                        data.push('EOF');
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
