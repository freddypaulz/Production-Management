import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import {
   Table,
   TableBody,
   TableHeader,
   TableCell,
   DataTableCell
} from '@david.kucsai/react-pdf-table';
import moment from 'moment';
// Create styles
const styles = StyleSheet.create({
   page: {
      flexDirection: 'coulmn',
      backgroundColor: '#fff',
      display: 'flex',
      justifyContent: 'center',
      fontSize: 10,
      width: '100%',
      padding: 20
   },
   section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
   }
});
// Create Document Component
export const ReportPDF = props => (
   <Document
      title={`Purchase Report ${new moment().format('DD/MM/YYYY HH:m:s')}`}
   >
      <Page orientation='landscape' size='A4' style={styles.page}>
         <Text
            style={{
               textAlign: 'center'
            }}
         >
            Purcase Report
         </Text>
         <View
            style={
               (styles.section,
               {
                  marginTop: '10'
               })
            }
         >
            <Table data={props.data}>
               <TableHeader fontSize='10'>
                  <TableCell style={{ padding: '5' }}>
                     Raw Material Name
                  </TableCell>
                  <TableCell style={{ padding: '5' }}>Material Code</TableCell>
                  <TableCell style={{ padding: '5' }}>Qty</TableCell>
                  <TableCell style={{ padding: '5' }}>Unit</TableCell>
                  <TableCell style={{ padding: '5' }}>Priority</TableCell>
                  <TableCell style={{ padding: '5' }}>Status</TableCell>
                  <TableCell style={{ padding: '5' }}>Vendor</TableCell>
                  <TableCell style={{ padding: '5' }}>Total Price</TableCell>
                  <TableCell style={{ padding: '5' }}>Created By</TableCell>
                  <TableCell style={{ padding: '5' }}>Designation</TableCell>
                  <TableCell style={{ padding: '5' }}>Date</TableCell>
               </TableHeader>
               <TableBody fontSize='10'>
                  <DataTableCell
                     style={{ padding: '5' }}
                     getContent={r => r.Raw_Material_Name}
                  />
                  <DataTableCell
                     style={{ padding: '5' }}
                     getContent={r => r.Raw_Material_Code}
                  />
                  <DataTableCell
                     style={{ padding: '5' }}
                     getContent={r => r.Quantity}
                  />
                  <DataTableCell
                     style={{ padding: '5', width: '10' }}
                     getContent={r => r.Measuring_Unit}
                  />
                  <DataTableCell
                     style={{ padding: '5' }}
                     getContent={r => r.Priority}
                  />
                  <DataTableCell
                     style={{ padding: '5' }}
                     getContent={r => r.Status}
                  />
                  <DataTableCell
                     style={{ padding: '5' }}
                     getContent={r => r.Vendor}
                  />
                  <DataTableCell
                     style={{ padding: '5' }}
                     getContent={r => r.Total_Price}
                  />
                  <DataTableCell
                     style={{ padding: '5' }}
                     getContent={r => r.Employee}
                  />
                  <DataTableCell
                     style={{ padding: '5' }}
                     getContent={r => r.Role}
                  />
                  <DataTableCell
                     style={{ padding: '5' }}
                     getContent={r => r.date}
                  />
               </TableBody>
            </Table>
         </View>
         <View style={styles.section}></View>
      </Page>
   </Document>
);
