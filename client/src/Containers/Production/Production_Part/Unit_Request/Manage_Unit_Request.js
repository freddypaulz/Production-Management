import React, { Component } from "react";
import MaterialTable from "material-table";
import { Box, DialogContent, Snackbar } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import axios from "axios";
import EditUnitRequest from "./Edit_Unit_Request";
import Alert from "@material-ui/lab/Alert";

export default class ManageUnitRequest extends Component {
  constructor(props) {
    super();
    this.EditData = {};
    this.state = {
      columns: [
        // { title: "Material ID", field: "Raw_Material_Id" },
        { title: "Material Name", field: "Raw_Material_Id" },
        { title: "Quantity", field: "Quantity" },
        {
          title: "Measuring Unit",
          field: "Measuring_Unit_Name"
        },
        { title: "Priority", field: "Priority" },
        { title: "Status", field: "Status" }
      ],
      data: [],
      openAdd: false,
      openEdit: false,
      open: false,
      alert: false,
      fieldDisabled: {
        Raw_Material_Id: false,
        Raw_Material_Code: false,
        Quantity: false,
        Measuring_Unit: false,
        Priority: false,
        Due_Date: false,
        Status: false,
        Comments: false,
        btnDisplay: "none",
        btnText: "Close"
      }
    };
    this.OnEditHandler = (event, rowData) => {
      axios
        .post("/production-unit", {
          _id: rowData._id
        })
        .then(res => {
          console.log(res.data[0]);
          this.EditData = { ...res.data[0] };
          console.log(this.EditData);
          this.setState({
            openEdit: true
          });
        });
    };
    this.handleClose = () => {
      axios.get("/production-unit").then(res => {
        console.log("reqdetails:", res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].id = i + 1;
          //Axios
          axios
            .post("/measuring-units/measuring-unit", {
              _id: res.data[i].Measuring_Unit
            })
            .then(MeasuringUnit => {
              console.log(MeasuringUnit);
              if (MeasuringUnit.data.MeasuringUnit[0]) {
                console.log(
                  MeasuringUnit.data.MeasuringUnit[0].measuring_unit_name
                );
                res.data[i].Measuring_Unit_Name =
                  MeasuringUnit.data.MeasuringUnit[0].measuring_unit_name;
                this.setState({
                  data: [...res.data]
                });
              } else {
                res.data[i].Measuring_Unit = "problem loading Measuring Unit";
                this.setState({
                  data: [...res.data]
                });
              }
            });
          //end
          //Axios
          axios
            .post("/raw-material", {
              _id: res.data[i].Raw_Material_Id
            })
            .then(MaterialId => {
              console.log(MaterialId);
              if (MaterialId.data.RawMaterial[0]) {
                console.log(MaterialId.data.RawMaterial[0].raw_material_name);
                res.data[i].Raw_Material_Id =
                  MaterialId.data.RawMaterial[0].raw_material_name;
                this.setState({
                  data: [...res.data]
                });
              } else {
                res.data[i].Raw_Material_Id = "problem loading";
                this.setState({
                  data: [...res.data]
                });
              }
            });
          //end
        }
      });
    };
  }
  componentDidMount() {
    this.handleClose();
  }
  render() {
    return (
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Box fontSize="30px" mb={3}>
          Manage Unit Request
        </Box>

        <MaterialTable
          title=" "
          columns={this.state.columns}
          data={this.state.data}
          style={{ width: "90%", maxHeight: "500px", overflow: "auto" }}
          options={{
            sorting: true,
            headerStyle: {
              backgroundColor: "#3f51b5",
              color: "#FFF",
              fontSize: "medium",
              fontWeight: "bold"
            }
          }}
          actions={[
            {
              icon: "edit",
              tooltip: "Edit User",
              onClick: (event, rowData) => {
                this.setState({
                  fieldDisabled: {
                    Raw_Material_Id: false,
                    Raw_Material_Code: false,
                    Quantity: false,
                    Measuring_Unit: false,
                    Priority: false,
                    Due_Date: false,
                    Status: false,
                    Comments: false,
                    btnDisplay: "flex",
                    btnText: "Cancel"
                  }
                });
                this.OnEditHandler(event, rowData);
              }
            }
          ]}
          // editable={{
          //   onRowDelete: oldData =>
          //     axios
          //       .post("/production-unit/delete", {
          //         _id: oldData._id
          //       })
          //       .then(unit => {
          //         console.log(unit);
          //         if (unit) {
          //           if (oldData.Status === "Accepted") {
          //             this.setState(prevState => {
          //               const data = [...prevState.data];
          //               data.splice(data.indexOf(oldData), 1);
          //               return { ...prevState, data };
          //             });
          //           } else {
          //             this.setState({
          //               alert: true
          //             });
          //           }
          //         }
          //       })
          // }}
          onRowClick={(event, rowData) => {
            this.setState({
              fieldDisabled: {
                Raw_Material_Id: true,
                Raw_Material_Code: true,
                Quantity: true,
                Measuring_Unit: true,
                Priority: true,
                Due_Date: true,
                Status: true,
                Comments: true,
                btnDisplay: "none",
                btnText: "Close"
              }
            });
            this.OnEditHandler(event, rowData);
          }}
        />

        <Dialog open={this.state.openEdit} maxWidth="lg" fullWidth>
          <DialogContent>
            <EditUnitRequest
              unit={this.EditData}
              disabled={this.state.fieldDisabled}
              cancel={() => {
                this.setState({
                  openEdit: false
                });
                this.handleClose();
              }}
            />
          </DialogContent>
        </Dialog>
        <Snackbar
          open={this.state.alert}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={this.closeAlert}
          style={{ paddingLeft: "20%", fontWeight: "bold" }}
        >
          <Alert variant="filled" severity="error">
            You cannot Modify / Delete this Record
          </Alert>
        </Snackbar>
      </Box>
    );
  }
}
