import React, { Component } from "react";
import MaterialTable from "material-table";
import { Box, Button, DialogContent } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { Route, Link } from "react-router-dom";
import axios from "axios";
import ProductQC from "./Product_QC";
import AddQC from "./Add_QC";
import EditQC from "./Edit_QC";

export default class ManageQC extends Component {
  constructor(props) {
    super();
    this.EditData = {};
    this.state = {
      columns: [
        { title: "QC Type", field: "QC_Type" },
        { title: "Name", field: "Product_Name" },
        { title: "Quantity", field: "Quantity" },
        { title: "Measuring Unit", field: "Measuring_Unit" },
        { title: "Result", field: "Result" }
        // { title: "Status", field: "Status" }
      ],
      data: [],
      openAdd: false,
      openEdit: false,
      fieldDisabled: {
        QC_Type: false,
        Product_Name: false,
        Product_ID: false,
        Measuring_Unit: false,
        Quantity: false,
        Id_Type: false,
        Id: false,
        QC_Date: null,
        Result: false,
        Comments: false,
        btnDisplay: "none",
        btnText: "Close"
      }
    };
    this.OnEditHandler = (event, rowData) => {
      axios
        .post("/quality-check", {
          _id: rowData._id
        })
        .then(res => {
          //console.log(Wastage);
          this.EditData = { ...res.data[0] };
          console.log(this.EditData);
          this.setState({
            openEdit: true
          });
        });
    };
    this.handleClose = () => {
      axios.get("/quality-check").then(res => {
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
            .post("/products/product", {
              _id: res.data[i].Product_Name
              //_id: res.data[i].Product_ID
            })
            .then(ProductName => {
              if (ProductName.data.Product) {
                console.log(ProductName);

                console.log(ProductName.data.Product[0].product_name);
                res.data[i].Product_Name =
                  ProductName.data.Product[0].product_name;
                this.setState({
                  data: [...res.data]
                });
              } else {
                res.data[i].Product_Name = "problem loading";
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
        //   data: [...res.data]
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
          Manage Quality Check
        </Box>
        {/* <Box display="flex" alignSelf="start">
          <Button
            variant="contained"
            color="primary"
            style={{
              marginBottom: "20px",
              display: "flex",
              marginRight: "10px"
            }}
            size="large"
            onClick={() => {
              this.setState({
                openAdd: true
              });
            }}
          >
            Add
          </Button>
        </Box> */}

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
          actions={[
            {
              icon: "edit",
              tooltip: "Edit User",
              onClick: (event, rowData) => {
                this.setState({
                  fieldDisabled: {
                    QC_Type: false,
                    Product_Name: false,
                    Product_ID: false,
                    Measuring_Unit: false,
                    Quantity: false,
                    Id_Type: false,
                    Id: false,
                    QC_Date: null,
                    Result: false,
                    Comments: false,
                    btnDisplay: "flex",
                    btnText: "Cancel"
                  }
                });
                this.OnEditHandler(event, rowData);
              }
            }
          ]}
          editable={{
            onRowDelete: oldData =>
              axios
                .post("/quality-check/delete", {
                  _id: oldData._id
                })
                .then(qc => {
                  console.log(qc);
                  if (qc) {
                    this.setState(prevState => {
                      const data = [...prevState.data];
                      data.splice(data.indexOf(oldData), 1);
                      return { ...prevState, data };
                    });
                  }
                })
          }}
          onRowClick={(event, rowData) => {
            this.setState({
              fieldDisabled: {
                QC_Type: true,
                Product_Name: true,
                Product_ID: true,
                Measuring_Unit: true,
                Quantity: true,
                Id_Type: true,
                Id: true,
                QC_Date: null,
                Result: true,
                Comments: true,
                btnDisplay: "none",
                btnText: "Close"
              }
            });
            this.OnEditHandler(event, rowData);
          }}
        />
        <Dialog open={this.state.openAdd} maxWidth="md" fullWidth>
          <DialogContent>
            <AddQC
              qualitycheck={this.EditData}
              cancel={() => {
                this.setState({
                  openAdd: false
                });
                // this.handleClose();
              }}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={this.state.openEdit} maxWidth="md" fullWidth>
          <DialogContent>
            <EditQC
              disabled={this.state.fieldDisabled}
              qualitycheck={this.EditData}
              cancel={() => {
                this.setState({
                  openEdit: false
                });
                // this.handleClose();
              }}
            />
          </DialogContent>
        </Dialog>
        <Box
          display=" flex"
          marginTop="20px"
          justifyContent="flex-end"
          width="94%"
          marginLeft="40px"
        >
          <Box width="100px">
            <Link to="/management/product-qc">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                fontWeight="Bold"
              >
                Cancel
              </Button>
            </Link>
            {/* <Route exact path="/management/product-qc" component={ProductQC} /> */}
          </Box>
        </Box>
      </Box>
    );
  }
}
