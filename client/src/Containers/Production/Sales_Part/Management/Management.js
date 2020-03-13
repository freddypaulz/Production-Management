import React from "react";
import { Box } from "@material-ui/core";
import Dashboard from "../Dashboard/Dashboard";
import { Route } from "react-router";

const Management = () => {
  const dashboardList = [
    { Name: "Preproduction", Path: "manageproduction" },
    { Name: "Raw Material Request", Path: "manage-raw-material" },
    { Name: "Manage Wastage", Path: "manage-wastage" },
    { Name: "Logout", Path: "logout" }
  ];
  return (
    <Box display="flex" height="100vh">
      <Dashboard items={dashboardList} componentName="management" />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        marginTop="20px"
        justifyContent="center"
      >
        {/* <Route
          exact
          path="/management/manageproduction"
          component={Manageproduction}
        />
        <Route
          exact
          path="/management/manage-raw-material"
          component={Manage_Raw_Material}
        />
        <Route
          path="/management/manageproduction/addform"
          component={Addform}
        />
        <Route
          path="/management/manage-raw-material/add-request"
          component={Addrequest}
        /> */}
      </Box>
    </Box>
  );
};

export default Management;
