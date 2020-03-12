import React from 'react';
import { Paper } from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
   paper: {
      padding: theme.spacing(3),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
      width: '90%',
      alignItems: 'center'
   },
   fixedHeight: {
      maxHeight: '29.5vw',
      minWidth: '300px',
      minHeight: '5px'
   }
}));

export const PaperBoard = props => {
   const classes = useStyles();
   const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
   return (
      <Paper className={fixedHeightPaper} elevation={2}>
         {props.children}
      </Paper>
   );
};
