import React, { Component } from "react";
import MaterialTable from "material-table";
import { Box, Button, DialogContent, Snackbar } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import axios from "axios";
import EditProductStock from "./Edit_Product_Stock";
import Alert from "@material-ui/lab/Alert";

export default class ManageRMStock extends Component {
  constructor(props) {
    super();
    this.EditData = {};
    this.state = {
      columns: [
        // { title: "Material ID", field: "Raw_Material_Id" },
        { title: "Material Name", field: "Raw_Material_Id" },
        { title: "Material Code", field: "Raw_Material_Code" },

        { title: "Quantity", field: "Quantity" },
        {
          title: "Measuring Unit",
          field: "Measuring_Unit"
        }
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

        btnDisplay: "none",
        btnText: "Close"
      }
    };
    this.closeAlert = () => {
      this.setState({ alert: false });
    };
    this.OnEditHandler = (event, rowData) => {
      axios
        .post("/production-raw-material-stock", {
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
      axios.get("/production-raw-material-stock").then(res => {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].id = i + 1;
          //Axios
          axios
            .post("/measuring-unit/measuring-unit", {
              _id: res.data[i].Measuring_Unit
            })
            .then(MeasuringUnit => {
              console.log(MeasuringUnit);
              if (MeasuringUnit.data.MeasuringUnit[0]) {
                console.log(
                  MeasuringUnit.data.MeasuringUnit[0].measuring_unit_name
                );
                res.data[i].Measuring_Unit =
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
              //_id: res.data[i].Product_ID
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
        // this.setState({
        //   data: [...res.data.Productions]
        // });
      });
    };
  }
  componentDidMount() {
    this.handleClose();
  }
  render() {
    return (
      <Box
        width="80%"
        display="flex"
        alignItems="center"
        flexDirection="column"
        height="100vh"
      >
        <Box fontSize="30px" mb={3} fontWeight="bold">
          Raw Material stock
        </Box>

        <MaterialTable
          title=" "
          columns={this.state.columns}
          data={this.state.data}
          style={{ width: "100%", overflow: "auto", alignItems: "left" }}
          options={{
            sorting: true,
            headerStyle: {
              backgroundColor: "#3f51b5",
              color: "#FFF",
              fontSize: "medium",
              fontWeight: "bold"
            }
          }}
          editable={{
            onRowDelete: oldData =>
              axios
                .post("/production-raw-material-stock/delete", {
                  _id: oldData._id
                })
                .then(RMRequest => {
                  console.log(RMRequest);
                  if (RMRequest) {
                    this.setState(prevState => {
                      const data = [...prevState.data];
                      data.splice(data.indexOf(oldData), 1);
                      return { ...prevState, data };
                    });

                    this.setState({
                      alert: true
                    });
                  }
                })
          }}
        />
      </Box>
    );
  }
}