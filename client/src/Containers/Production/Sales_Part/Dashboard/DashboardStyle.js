import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
  boxOutProp: {
    color: "#000",
    backgroundColor: "#f5f6fc",
    padding: 0,
    minWidth: "20vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    maxHeight: "100vh",
    overflow: "auto"
  },

  boxInProp: {
    fontSize: "1.2vw",
    color: "black",
    fontWeight: "bold",
    textDecoration: "none",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#e4e5f0",
      color: "#7d8cfa"
    }
  },

  position: {
    display: "flex",
    position: "sticky",
    fontSize: "2.0vw",
    fontWeight: "bold",
    backgroundColor: "#3f51b5",
    color: "white",
    padding: 20,
    top: 0,
    flexDirection: "row"
  }
}));
