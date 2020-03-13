import { makeStyles } from "@material-ui/styles";
// import { Divider } from "@material-ui/core";
// import {
//   theme
// } from "@material-ui/styles/ThemeProvider/ThemeProvider";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },

  heading: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    paddingTop: "15px",
    paddingBottom: "25px"
  },
  lbox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "90%",
    justifyContent: "space-around",
    paddingBottom: "50px",
    paddingTop: "30px"
  },
  boxSize2: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    paddingTop: "5px",
    paddingLeft: "5px",
    paddingRight: "5px",
    paddingBottom: "5px",
    minWidth: "10%",
    maxWidth: "100%"
  },
  lastboxSize2: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    paddingTop: "5px",
    paddingLeft: "15px",
    paddingRight: "15px",
    paddingBottom: "20px"
  },
  addbtns: {
    display: "flex",
    alignSelf: "center",
    paddingLeft: "10px",
    paddingRight: "10px"
  },
  addbtnl: {
    display: "flex",
    alignSelf: "flex-end",
    paddingLeft: "10px",
    paddingRight: "10px"
  },
  submit: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "20px",
    paddingBottom: "10px",
    marginRight: "60px",
    alignSelf: "flex-end"
  },
  add: {
    display: "flex",
    justifyContent: "flex-start",
    paddingTop: "20px",
    paddingBottom: "10px",
    marginRight: "60px",
    alignSelf: "flex-start"
  },
  paper: {
    overflow: "auto",
    width: "100%"
  },
  table: {
    overflow: "auto"
  }
  // formControl: {
  //   margin: theme.spacing(1),
  //   minWidth: 120
  // }
});

export default useStyles;
