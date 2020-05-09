import React, { Component } from "react";
import MaterialTable from "material-table";
import { Box, DialogContent, LinearProgress } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import axios from "axios";
import Qualitycheck from "./Add_QC";

export default class ProductQC extends Component {
  constructor(props) {
    super();
    this.EditData = {};
    this.state = {
      columns: [
        { title: "Batch ID", field: "Batch_Id" },
        { title: "Product Name", field: "Product_Name" },
        { title: "Quantity", field: "Quantity" },
        {
          title: "Measuring Unit",
          field: "Measuring_Unit",
        },
        {
          title: "Status",
          field: "Status",
        },
      ],
      data: [],
      openAdd: false,
      openEdit: false,
      msg: "Fetching Data...",
      isLoading: true,
      progress: 0,
    };
    this.OnEditHandler = (event, rowData) => {
      axios
        .post("/production", {
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
    this.handleClose = () => {
      axios.get("/production/qc").then((res) => {
        console.log("production--", res.data);

        for (let i = 0; i < res.data.length; i++) {
          // if (res.data[i].Status !== "Packing QC Success") {
          res.data[i].id = i + 1;
          // console.log("--", res.data[0].Status);

          //Axios
          axios
            .post("/measuring-units/measuring-unit", {
              _id: res.data[i].Measuring_Unit,
            })
            .then((MeasuringUnit) => {
              console.log(MeasuringUnit);
              if (MeasuringUnit.data.MeasuringUnit[0]) {
                console.log(
                  MeasuringUnit.data.MeasuringUnit[0].measuring_unit_name
                );
                res.data[i].Measuring_Unit =
                  MeasuringUnit.data.MeasuringUnit[0].measuring_unit_name;
                this.setState({
                  data: [...res.data],
                  progress: 70,
                });
              } else {
                res.data[i].Productions.Measuring_Unit =
                  "problem loading Measuring Unit";
                this.setState({
                  data: [...res.data],
                  progress: 70,
                });
              }
            });
          //end
          //Axios
          axios
            .post("/products/product", {
              _id: res.data[i].Product_Name,
              //_id: res.data[i].Product_ID
            })
            .then((ProductName) => {
              console.log(ProductName.data.Product[0].product_name);
              if (ProductName.data.Product) {
                console.log(ProductName.data.Product[0].product_name);
                res.data[i].Product_Name =
                  ProductName.data.Product[0].product_name;
                this.setState({
                  data: [...res.data],
                  progress: 100,

                  isLoading: false,
                });
              } else {
                res.data[i].Product_Name = "problem loading";
                this.setState({
                  data: [...res.data],
                  progress: 100,

                  isLoading: false,
                });
              }
            });
          //end
          // }
          // this.setState({
          //   data: [...res.data.Productions]
          // });
        }

        let i = 0;
        if (i >= res.data.length)
          this.setState({
            progress: 100,
            msg: "Data Not Found!",
            isLoading: false,
          });
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
          Product List for QC
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
              icon: "playlist_add_check_two_tone",
              tooltip: "Quality Check",
              onClick: (event, rowData) => {
                if (
                  rowData.Status !== "Product QC Failed" &&
                  rowData.Status !== "Packing QC Failed"
                ) {
                  this.OnEditHandler(event, rowData);
                } else {
                  alert("Waiting for Production Check");
                }
              },
            },
          ]}
          //   editable={{
          //     onRowDelete: oldData =>
          //       axios
          //         .post("/pre-production/delete", {
          //           _id: oldData._id
          //         })
          //         .then(Production => {
          //           console.log(Production);
          //           if (Production) {
          //             this.setState(prevState => {
          //               const data = [...prevState.data];
          //               data.splice(data.indexOf(oldData), 1);
          //               return { ...prevState, data };
          //             });
          //           }
          //         })
          //   }}
          // onRowClick={(event, rowData) => {
          //   this.OnEditHandler(event, rowData);
          // }}
        />
        <Dialog open={this.state.openEdit} maxWidth="lg" fullWidth>
          <DialogContent>
            <Qualitycheck
              qualitycheck={this.EditData}
              cancel={() => {
                this.setState({
                  openEdit: false,
                });
                this.handleClose();
              }}
            />
          </DialogContent>
        </Dialog>
      </Box>
    );
  }
}
