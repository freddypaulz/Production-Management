import React, { useState } from 'react';
//
import { PaperBoard } from '../PaperBoard/PaperBoard';
import styles from '../styles/FormStyles';
import { Box, TextField, Select, MenuItem } from '@material-ui/core';
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
         <PaperBoard>
            <Box width='900px' height='400px' overflow='hidden'>
               <Chart
                  data={data}
                  series={series}
                  axes={axes}
                  getSeriesStyle={getSeriesStyle}
                  getDatumStyle={getDatumStyle}
                  tooltip
               />
            </Box>
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
         </PaperBoard>
      </Box>
   );
};
