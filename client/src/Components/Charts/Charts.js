import React, { useState } from 'react';
//
import styles from '../styles/FormStyles';
import { Box, Select, MenuItem, Button } from '@material-ui/core';
import { Chart } from 'react-charts';
export const Charts = props => {
   const [state, setState] = useState('line');
   const data = React.useMemo(() => props.ChartContent, [props.ChartContent]);

   const series = React.useMemo(
      () => ({
         type: state
      }),
      [state]
   );

   const axes = React.useMemo(
      () => [
         { primary: true, type: 'ordinal', position: 'bottom' },
         { type: 'linear', position: 'left' }
      ],
      []
   );
   const getSeriesStyle = React.useCallback(
      () => ({
         transition: 'all .5s ease'
      }),
      []
   );
   const getDatumStyle = React.useCallback(
      () => ({
         transition: 'all .5s ease'
      }),
      []
   );
   return (
      <Box style={styles.box}>
         <Box
            width='90%'
            height='400px'
            overflow='hidden'
            border='1px solid black'
            padding='10px'
         >
            <Chart
               data={data}
               series={series}
               axes={axes}
               getSeriesStyle={getSeriesStyle}
               getDatumStyle={getDatumStyle}
               tooltip
            />
         </Box>
         <Box style={{ marginTop: '20px' }}>
            <Select
               value={state}
               onChange={e => {
                  setState(e.target.value);
               }}
            >
               <MenuItem value='bar'>Bar</MenuItem>
               <MenuItem value='line'>Line</MenuItem>
               <MenuItem value='area'>Area</MenuItem>
            </Select>
         </Box>
         <Box
            display=' flex'
            marginTop='10px'
            justifyContent='flex-end'
            width='92%'
         >
            <Box width='100px'>
               <Button
                  fullWidth
                  variant='contained'
                  color='primary'
                  size='large'
                  onClick={() => {
                     props.cancel();
                  }}
               >
                  Close
               </Button>
            </Box>
         </Box>
      </Box>
   );
};
