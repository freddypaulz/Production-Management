import React from 'react';
import { Box, Divider } from '@material-ui/core';
import { useStyles } from './DashboardStyle.js';
import { NavLink } from 'react-router-dom';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';

export default function Dashboard(props) {
   const classes = useStyles();

   const styles = {
      navStyle: {
         display: 'flex',
         textDecoration: 'none',
         padding: '15px',
         color: 'black'
      },
      navStyleActive: {
         color: '#3f51b5'
      }
   };
   return (
      <Box display='flex'>
         <Box
            maxWidth={props.width}
            component='div'
            className={classes.boxOutProp}
         >
            <Box className={classes.position}>
               <Box
                  display='flex'
                  flexDirection='row'
                  width='100vw'
                  // bgcolor='red'
                  justifyContent='space-between'
               >
                  <Box
                     fontSize='30px'
                     //  bgcolor='blue'
                     marginLeft='5px'
                  >
                     DASHBOARD
                  </Box>
               </Box>
            </Box>
            <Divider />
            {props.items.map((item, index) => {
               return (
                  <div key={index}>
                     <Box className={classes.boxInProp}>
                        <NavLink
                           activeStyle={styles.navStyleActive}
                           style={styles.navStyle}
                           to={`/${props.componentName}/${item.Path}`}
                        >
                           {item.Name}
                        </NavLink>
                     </Box>
                     <Divider />
                  </div>
               );
            })}
         </Box>
         {props.dashboard === '.1px' ? (
            <Box
               style={{
                  color: 'black',
                  display: 'flex',
                  padding: '20px'
               }}
            >
               <MenuRoundedIcon style={{ fontSize: '40px' }} />
            </Box>
         ) : null}
      </Box>
   );
}
