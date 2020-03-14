import React, { Component } from 'react';
import { Charts } from '../../../../Components/Charts/Charts';
import styles from '../../../../Components/styles/FormStyles';
import { PaperBoard } from '../../../../Components/PaperBoard/PaperBoard';
import { Datepick } from '../../../../Components/Date/Datepick';
import { Box, Button, Dialog, DialogContent } from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';

export default class ProductionAndSales extends Component {
   state = {
      start_date: null,
      end_date: null,
      label: '',
      ProductionData: [],
      SalesData: [],
      ChartContent: [],
      ChartOpen: false
   };
   onReportHandler = () => {
      this.setState({
         ChartContent: [],
         ProductionData: [],
         SalesData: []
      });

      // this.setState({
      //    ChartOpen: true
      // });
      //sales

      axios
         .post('/sales/sale', {
            start_date: this.state.start_date,
            end_date: this.state.end_date
         })
         .then(res => {
            console.log(res.data);
            res.data.Sale.map(Sale => {
               this.setState({
                  label: 'Sales'
               });
               this.setState(prevState => {
                  prevState.SalesData.push([
                     Sale.Product_ID +
                        '-' +
                        new moment(Sale.Selling_Date).format('MMM-YYYY'),
                     Sale.Quantity
                  ]);
               });
               return null;
            });
            this.setState(prevState => {
               prevState.ChartContent.push({
                  label: prevState.label,
                  data: prevState.SalesData
               });
            });
            axios
               .post('/productions/production', {
                  start_date: this.state.start_date,
                  end_date: this.state.end_date
               })
               .then(res => {
                  console.log(res.data);
                  res.data.Production.map(Production => {
                     this.setState({
                        label: 'Production'
                     });
                     this.setState(prevState => {
                        prevState.ProductionData.push([
                           //new moment(Production.date).format('MM-YYYY'),
                           Production.Product_ID +
                              '-' +
                              new moment(Production.Manufacture_Date).format(
                                 'MMM-YYYY'
                              ),
                           Production.Quantity
                        ]);
                     });
                     return null;
                  });
                  this.setState(prevState => {
                     prevState.ChartContent.push({
                        label: prevState.label,
                        data: prevState.ProductionData
                     });
                  });
                  this.setState({
                     ChartOpen: true
                  });
                  console.log(this.state.ChartContent);
               });
         });
   };
   componentDidMount() {}
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Production And Sales Report
            </Box>
            <PaperBoard>
               <Box style={styles.box_field}>
                  <Box style={styles.box} marginRight='10px'>
                     <Datepick
                        id='1'
                        Name='Select Start month'
                        Req={true}
                        value={this.state.start_date}
                        minDate={new Date('01-01-1990')}
                        maxDate={new Date()}
                        setDate={date => {
                           this.setState({
                              start_date: date.startOf('month')
                           });
                        }}
                     />
                  </Box>
                  <Box style={styles.box}>
                     <Datepick
                        id='2'
                        Name='Select End Month'
                        Req={true}
                        value={this.state.end_date}
                        minDate={this.state.start_date}
                        maxDate={new moment() + 1000 * 60 * 60 * 24 * 30}
                        setDate={date => {
                           this.setState({
                              end_date: date.endOf('month')
                           });
                        }}
                     />
                  </Box>
               </Box>
            </PaperBoard>
            <Box
               display=' flex'
               marginTop='20px'
               justifyContent='flex-end'
               width='94%'
            >
               <Box width='100px'>
                  <Button
                     fullWidth
                     variant='contained'
                     color='primary'
                     size='large'
                     onClick={() => {
                        this.onReportHandler();
                     }}
                  >
                     Report
                  </Button>
               </Box>
            </Box>
            <Dialog fullWidth maxWidth='lg' open={this.state.ChartOpen}>
               <DialogContent style={{ padding: '20px' }}>
                  <Box fontSize='30px' mb={3} textAlign='center'>
                     Production and Sales report
                  </Box>
                  <Charts
                     cancel={() => {
                        this.setState({
                           ChartOpen: false
                        });
                     }}
                     ChartContent={this.state.ChartContent}
                  />
               </DialogContent>
            </Dialog>
            {/* <Charts ChartContent={this.state.ChartContent} /> */}
         </Box>
      );
   }
}
