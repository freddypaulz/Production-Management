import React, { Component } from 'react';
import { Charts } from '../../../../Components/Charts/Charts';
import styles from '../../../../Components/styles/FormStyles';
import { PaperBoard } from '../../../../Components/PaperBoard/PaperBoard';
import { Datepick } from '../../../../Components/Date/Datepick';
import {
   Box,
   Button,
   Dialog,
   DialogContent,
   LinearProgress,
} from '@material-ui/core';
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
      ChartOpen: false,
      end_date_disabled: true,
      dataReceived: false,
   };
   onReportHandler = () => {
      this.setState({
         ChartContent: [],
         ProductionData: [],
         SalesData: [],
         dataReceived: false,
      });

      axios
         .post('/sales/sale', {
            start_date: this.state.start_date,
            end_date: this.state.end_date,
         })
         .then((res) => {
            console.log(res.data);
            res.data.Sale.map((Sale) => {
               this.setState({
                  label: 'Sales',
               });
               this.setState((prevState) => {
                  prevState.SalesData.push([
                     new moment(Sale.Selling_Date).format('MM-YYYY') +
                        '-' +
                        Sale.Product_ID,
                     Sale.Quantity,
                  ]);
               });
               return null;
            });
            console.log(
               `sort ====> ${this.state.SalesData.sort((a, b) => {
                  return b[0] - a[0];
               }).reverse()} `
            );
            this.setState((prevState) => {
               prevState.ChartContent.push({
                  label: prevState.label,
                  data: prevState.SalesData.sort((a, b) => {
                     return b[0] - a[0];
                  }),
               });
            });
            axios
               .post('/productions/production', {
                  start_date: this.state.start_date,
                  end_date: this.state.end_date,
               })
               .then((res) => {
                  console.log(res.data);
                  res.data.Production.map((Production) => {
                     this.setState({
                        label: 'Production',
                     });
                     this.setState((prevState) => {
                        prevState.ProductionData.push([
                           new moment(Production.Manufacture_Date).format(
                              'MM-YYYY'
                           ) +
                              '-' +
                              Production.Product_ID,
                           Production.Quantity,
                        ]);
                     });
                     return null;
                  });
                  console.log(
                     `sort ====> ${this.state.ProductionData.sort((a, b) => {
                        return b[0] - a[0];
                     }).reverse()} `
                  );
                  this.setState((prevState) => {
                     prevState.ChartContent.push({
                        label: prevState.label,
                        data: prevState.ProductionData.sort((a, b) => {
                           return b[0] - a[0];
                        }),
                     });
                  });
                  this.setState({
                     ChartOpen: true,
                     dataReceived: true,
                  });
                  console.log(this.state.ChartContent);
               });
         });
   };
   componentDidMount() {
      this.setState({
         dataReceived: true,
      });
   }
   render() {
      return (
         <Box style={styles.box}>
            <Box fontSize='30px' mb={3}>
               Production And Sales Report
            </Box>
            <Box width='94%'>
               {!this.state.dataReceived ? <LinearProgress /> : null}
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
                        setDate={(date) => {
                           this.setState({
                              start_date: date.startOf('month'),
                              end_date_disabled: false,
                           });
                        }}
                     />
                  </Box>
                  <Box style={styles.box}>
                     <Datepick
                        id='2'
                        Name='Select End Month'
                        Req={true}
                        disabled={this.state.start_date !== null ? false : true}
                        value={this.state.end_date}
                        minDate={this.state.start_date}
                        maxDate={new moment().endOf('month')}
                        setDate={(date) => {
                           this.setState({
                              end_date: date.endOf('month'),
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
                           ChartOpen: false,
                        });
                     }}
                     ChartContent={this.state.ChartContent}
                  />
               </DialogContent>
            </Dialog>
         </Box>
      );
   }
}
