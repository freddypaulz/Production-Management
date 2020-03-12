import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import AppsIcon from '@material-ui/icons/Apps';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import T from './T.png';

const useStyles = makeStyles(theme => ({
   root: {
      flexGrow: 1
   },
   menuButton: {
      marginRight: theme.spacing(2),
      color: '#ed3237',
      transition: 'all .3s'
   },
   title: {
      flexGrow: 1
   },
   expand: {
      transform: 'rotate(45deg)',
      color: '#fff',
      transition: 'all .3s'
   }
}));

export default function ButtonAppBar(props) {
   const [expanded, setExpanded] = useState(true);
   const [anchorEl, setAnchorE1] = useState(null);
   const classes = useStyles();

   return (
      <Box className={classes.root}>
         <AppBar position='static'>
            <Toolbar>
               <IconButton
                  edge='start'
                  className={clsx(
                     { [classes.expand]: expanded },
                     classes.menuButton
                  )}
                  color='inherit'
                  aria-label='menu'
                  onClick={() => {
                     if (expanded) {
                        setExpanded(!expanded);
                        props.dashboardMin();
                     } else {
                        setExpanded(!expanded);
                        props.dashboardMax();
                     }
                  }}
               >
                  <AppsIcon />
               </IconButton>
               <Typography variant='h6' className={classes.title}>
                  {props.name}
               </Typography>
               {!props.homeButtonDisable ? (
                  <Button color='inherit' onClick={props.home}>
                     Home
                  </Button>
               ) : null}

               <Button
                  color='inherit'
                  onClick={event => setAnchorE1(event.currentTarget)}
               >
                  <AccountCircleOutlinedIcon
                     style={{ fontSize: '25px', marginRight: '5px' }}
                  />
                  {sessionStorage.getItem('User Name')}
               </Button>
               <img
                  src={T}
                  alt='Logo'
                  style={{
                     marginLeft: '10px',
                     width: '20px',
                     height: '30px',
                     backgroundColor: 'white',
                     padding: '5px',
                     borderRadius: '5px'
                  }}
               ></img>
               <Menu
                  style={{ marginTop: '40px' }}
                  id='user-menu'
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  TransitionComponent={Fade}
                  onClose={() => {
                     setAnchorE1(null);
                  }}
               >
                  <MenuItem onClick={props.logout}>
                     <ExitToAppIcon
                        style={{
                           fontSize: '20px',
                           marginRight: '5px',
                           padding: '5px'
                        }}
                     />
                     Logout
                  </MenuItem>
               </Menu>
            </Toolbar>
         </AppBar>
      </Box>
   );
}
