import React from "react";
import { Box, Divider } from "@material-ui/core";
import { useStyles } from "./DashboardStyle";
import { NavLink } from "react-router-dom";
import "./Dashboard.css";
import Logo from "./logo.png";

export default function Dashboard(props) {
  const classes = useStyles();
  const styles = {
    navStyle: {
      display: "flex",
      textDecoration: "none",
      padding: "20px",
      color: "black"
    },
    navStyleActive: {
      color: "#3f51b5"
    }
  };
  console.log(props.items);
  return (
    <Box display="flex">
      <Box component="div" className={classes.boxOutProp}>
        <Box
          className={classes.logo}
          width="17vw"
          display="flex"
          alignSelf="center"
          height="6vh"
          p={2}
        >
          <img src={Logo} alt="Logo" width="100%" />
        </Box>
        <Box className={classes.position}>DASHBOARD</Box>
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
    </Box>
  );
}
