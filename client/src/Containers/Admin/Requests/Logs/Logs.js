import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
const useStyles = makeStyles({
   root: {
      minWidth: 275
   },
   bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)'
   },
   title: {
      fontSize: 14
   },
   pos: {
      marginBottom: 12
   }
});

const Logs = props => {
   const [data] = useState(props.data);
   useEffect(() => {
      console.log(data);
   }, [data]);
   const classes = useStyles();
   return (
      <Box
         display='flex'
         flexDirection='column'
         justifyContent='center'
         alignItems='center'
      >
         <Box fontSize='30px' mb={3}>
            Request Log
         </Box>
         <Box
            display='flex'
            width='100%'
            flexDirection='column'
            alignItems='center'
            bgcolor='#d6f2ff'
            maxHeight='500px'
            overflow='auto'
         >
            {data.map((data, index) => {
               let bgcolor =
                  data.Address.From === 'Admin' ? '#ccffd2' : 'white';
               return (
                  <Box
                     key={index}
                     display='flex'
                     alignItems={
                        data.Address.From === 'Admin'
                           ? 'flex-end'
                           : 'flex-start'
                     }
                     padding='5px'
                     width='90%'
                     flexDirection='column'
                  >
                     <Card
                        className={classes.root}
                        style={{
                           color: 'red',
                           backgroundColor: `${bgcolor}`,
                           // marginBottom: '10px',
                           width: '40%'
                        }}
                     >
                        <CardContent>
                           <Typography
                              className={classes.title}
                              color='textSecondary'
                              gutterBottom
                           >
                              {data.Address.From} To {data.Address.To}
                           </Typography>
                           <Typography
                              className={classes.pos}
                              color='textSecondary'
                           >
                              {new moment(data.Entry_Date).format(
                                 'DD-MM-YYYY HH:m:s'
                              )}
                           </Typography>
                           <Typography variant='body2' component='p'>
                              {data.Comments}
                           </Typography>
                        </CardContent>
                        {/* <CardActions>
               <Button size='small'>Learn More</Button>
            </CardActions> */}
                     </Card>
                  </Box>
               );
            })}
         </Box>
      </Box>
   );
};

export default Logs;
