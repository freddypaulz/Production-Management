import React, { Component } from "react";
import MaterialTable from "material-table";
import {
  Box,
  Button,
  DialogContent,
  Snackbar,
  LinearProgress,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import axios from "axios";
import AddRMRequest from "./Add_RM_Request";
import EditRMRequest from "./Edit_RM_Request";
import Alert from "@material-ui/lab/Alert";

export default class ManageRMRequest extends Component {
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
          field: "Measuring_Unit",
        },
        { title: "Priority", field: "Priority" },
        { title: "Status", field: "Status" },
      ],
      data: [],
      materials: [],

      openAdd: false,
      openEdit: false,
      open: false,
      alert: false,
      msg: "Fetching Data...",
      isLoading: true,
      progress: 0,
      materialList: [],
      unitList: [],
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
        btnText: "Close",
      },
    };
    this.closeAlert = () => {
      this.setState({ alert: false });
    };
    this.OnEditHandler = (event, rowData) => {
      axios
        .post("/request-details", {
          _id: rowData._id,
        })
        .then((res) => {
          console.log(res.data[0]);
          this.EditData = { ...res.data[0] };
          console.log(this.EditData);
          this.setState({
            openEdit: true,
            progress: 40,
          });
        });
    };
    // this.handleClose = () => {
    //   axios.get("/request-details").then((res) => {
    //     console.log(res.data);

    //     for (let i = 0; i < res.data.length; i++) {
    //       res.data[i].id = i + 1;
    //       if (
    //         res.data[i].Created_By.Role_Id === sessionStorage.getItem("Role ID")
    //       ) {
    //         //Axios
    //         // axios
    //         //   .post("/measuring-units/measuring-unit", {
    //         //     _id: res.data[i].Measuring_Unit,
    //         //   })
    //         //   .then((MeasuringUnit) => {
    //         //     console.log(MeasuringUnit);
    //         //     if (MeasuringUnit.data.MeasuringUnit[0]) {
    //         //       console.log(
    //         //         MeasuringUnit.data.MeasuringUnit[0].measuring_unit_name
    //         //       );
    //         //       res.data[i].Measuring_Unit =
    //         //         MeasuringUnit.data.MeasuringUnit[0].measuring_unit_name;
    //         //       this.setState({
    //         //         data: [...res.data],
    //         //         progress: 60,

    //         //         msg: "Data Not Found...",
    //         //       });
    //         //     } else {
    //         //       res.data[i].Measuring_Unit = "problem loading Measuring Unit";
    //         //       this.setState({
    //         //         data: [...res.data],
    //         //         progress: 60,

    //         //         msg: "Data Not Found...",
    //         //       });
    //         //     }
    //         //   });
    //         // //end
    //         // //Axios
    //         // axios
    //         //   .post("/raw-materials/raw-material", {
    //         //     _id: res.data[i].Raw_Material_Id,
    //         //     //_id: res.data[i].Product_ID
    //         //   })
    //         //   .then((MaterialId) => {
    //         //     console.log(MaterialId);
    //         //     if (MaterialId.data.RawMaterial[0]) {
    //         //       console.log(MaterialId.data.RawMaterial[0].raw_material_name);
    //         //       res.data[i].Raw_Material_Id =
    //         //         MaterialId.data.RawMaterial[0].raw_material_name;
    //         //       this.setState({
    //         //         progress: 100,
    //         //         data: [...res.data],
    //         //         msg: "Data Not Found...",
    //         //         isLoading: false,
    //         //       });
    //         //     } else {
    //         //       res.data[i].Raw_Material_Id = "problem loading";
    //         //       this.setState({
    //         //         data: [...res.data],
    //         //         progress: 100,
    //         //         msg: "Data Not Found...",
    //         //         isLoading: false,
    //         //       });
    //         //     }
    //         //   });
    //         //end
    //       }

    //       // this.setState({
    //       //   data: [...res.data.Productions]
    //       // });
    //     }
    //   });
    // };
    this.getMaterialName = (id) => {
      let temp = id;
      this.state.materialList.map((material) => {
        if (material._id === id) {
          temp = material.raw_material_name;
        }
        return null;
      });
      return temp;
    };
    this.getUnit = (id) => {
      let temp = id;
      this.state.unitList.map((unit) => {
        if (unit._id === id) {
          temp = unit.measuring_unit_name;
        }
        return null;
      });
      return temp;
    };

    this.handleClose = () => {
      axios.get("/raw-material").then((res) => {
        console.log(res);
        this.setState({
          materials: [...res.data.RawMaterials],
        });
        // console.log("Product: ", this.state.products);
      });
      //get Material List
      axios
        .get("/raw-materials/raw-materials")
        .then((res) => {
          this.setState({
            materialList: [...res.data.RawMaterials],
            progress: 35,
          });
          axios
            .get("/measuring-units/measuring-units")
            .then((res) => {
              this.setState({
                unitList: [...res.data.MeasuringUnits],
                progress: 70,
              });
              axios.get("/request-details").then((res) => {
                let temp = [];
                console.log("Details: ", res.data);

                for (let i = 0; i < res.data.length; i++) {
                  if (
                    res.data[i].Created_By.Role_Id ===
                    sessionStorage.getItem("Role ID")
                  ) {
                    res.data[i].Raw_Material_Id = this.getMaterialName(
                      res.data[i].Raw_Material_Id
                    );
                    res.data[i].Measuring_Unit = this.getUnit(
                      res.data[i].Measuring_Unit
                    );
                    temp.push(res.data[i]);
                  }
                }
                this.setState({
                  progress: 100,
                  data: temp,
                  reqDetails: [...res.data],
                  isLoading: false,
                });
              });
            })
            .catch((err) => {
              console.log("cannot get unitList", err);
            });
        })
        .catch((err) => {
          console.log("cannot get materialList", err);
        });

      //get Unit List

      //get Request Details
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
          Manage Raw Material Request
        </Box>
        <Box width="90%" display="flex" flexDirection="row">
          <Button
            variant="contained"
            color="primary"
            style={{
              marginBottom: "20px",
              display: "flex",
              marginRight: "10px",
            }}
            size="large"
            onClick={() => {
              this.setState({
                openAdd: true,
              });
            }}
          >
            Add
          </Button>
        </Box>

        <MaterialTable
          title=" "
          isLoading={this.state.isLoading}
          columns={this.state.columns}
          data={this.state.data}
          style={{ width: "90%", maxHeight: "500px", overflow: "auto" }}
          localization={{
            body: {
              emptyDataSourceMessage: this.state.msg,
            },
          }}
          components={{
            OverlayLoading: (props) => (
              <LinearProgress
                variant="determinate"
                value={this.state.progress}
              ></LinearProgress>
            ),
          }}
          options={{
            sorting: true,
            headerStyle: {
              backgroundColor: "#3f51b5",
              color: "#FFF",
              fontSize: "medium",
              fontWeight: "bold",
            },
          }}
          actions={[
            {
              icon: "edit",
              tooltip: "Edit",
              onClick: (event, rowData) => {
                if (rowData.Status === "Requesting") {
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
                      btnText: "Cancel",
                    },
                  });
                  this.OnEditHandler(event, rowData);
                } else {
                  this.setState({ alert: true });
                }
              },
            },
          ]}
          // editable={{
          //   onRowDelete: oldData =>
          //     axios
          //       .post("/request-details/delete", {
          //         _id: oldData._id
          //       })
          //       .then(unit => {
          //         console.log(unit);
          //         if (unit) {
          //           if (oldData.Status === "Requesting") {
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
                btnText: "Close",
              },
            });
            this.OnEditHandler(event, rowData);
          }}
        />
        <Dialog open={this.state.openAdd} maxWidth="lg" fullWidth>
          <DialogContent>
            <AddRMRequest
              cancel={() => {
                this.setState({
                  openAdd: false,
                });
                this.handleClose();
              }}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={this.state.openEdit} maxWidth="lg" fullWidth>
          <DialogContent>
            <EditRMRequest
              disabled={this.state.fieldDisabled}
              RMRequest={this.EditData}
              MaterialRecord={() => {
                let temp = [];
                this.state.materials.map((material) => {
                  if (material._id === this.EditData.Raw_Material_Id) {
                    temp = material;
                  }
                  return null;
                });
                return temp;
              }}
              cancel={() => {
                this.setState({
                  openEdit: false,
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
          // style={{ paddingLeft: "20%", fontWeight: "bold" }}
        >
          <Alert variant="filled" severity="error" onClose={this.closeAlert}>
            You cannot Modify / Delete this Record
          </Alert>
        </Snackbar>
      </Box>
    );
  }
}
