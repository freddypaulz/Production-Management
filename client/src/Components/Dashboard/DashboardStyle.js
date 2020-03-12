import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
   boxOutProp: {
      color: '#000',
      backgroundColor: '#f5f6fc',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      maxHeight: '92vh',
      minHeight: '92vh',
      overflow: 'auto',
      transition: 'all .2s',
      '&:hover': {
         cursor: 'pointer',
         maxWidth: '17vw',
         transition: 'all .2s',
         '&::-webkit-scrollbar': {
            width: '0.25em'
         },

         '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
         }
      },
      '&::-webkit-scrollbar': {
         width: '0.0em'
      }
   },
   boxInProp: {
      fontSize: '1.2vw',
      color: 'black',
      fontWeight: 'bold',
      textDecoration: 'none',
      '&:hover': {
         cursor: 'pointer',
         color: '#7d8cfa',
         transition: 'all .2s',
         backgroundColor: '#e4e5f0'
      }
   },

   position: {
      display: 'flex',
      position: 'sticky',
      backgroundColor: '#f5f6fc',
      // backgroundColor: '#3f51b5',
      color: 'black',
      padding: 10,
      top: 0,
      fontWeight: 'bold',
      flexDirection: 'row',
      width: '92.5%'
   }
}));
