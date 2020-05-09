import React, { Component } from "react";
import MaterialTable from "material-table";
import { Box, Button, DialogContent, LinearProgress } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import axios from "axios";
import AddSales from "./Add_Sales.js";
import EditSales from "./Edit_Sales";

export default class ManageSales extends Component {
  constructor(props) {
    super();
    this.EditData = {};
    this.state = {
      columns: [
        { title: "Name", field: "Product_Name" },
        { title: "Quantity", field: "Quantity" },
        { title: "Measuring Unit", field: "Measuring_Unit" },
        { title: "Distributor", field: "Distributor" },
        { title: "Price", field: "Price" },
        { title: "Balance", field: "Balance" },
      ],
      data: [],
      openAdd: false,
      openEdit: false,
      msg: "Fetching Data...",
      isLoading: true,
      progress: 0,
      fieldDisabled: {
        Product_Name: false,
        Product_ID: false,
        Quantity: false,
        Measuring_Unit: false,
        Box_Id: false,
        Selling_Date: false,
        Distributor: false,
        Payment_Type: false,
        Price: false,
        Final_Price: false,
        Discount: false,
        Advance: false,
        Balance: false,
        btnDisplay: "none",
        btnText: "Close",
        products: [],
      },
    };
    this.OnEditHandler = (event, rowData) => {
      axios
        .post("/sales", {
          _id: rowData._id,
        })
        .then((res) => {
          this.EditData = { ...res.data[0] };
          console.log(this.EditData);
          this.setState({
            openEdit: true,
            progress: 30,
          });
        });
    };
    this.handleClose = () => {
      // axios.get("/production-stock/stock").then((res) => {
      //   console.log("products", res.data);
      //   this.setState({ products: [...res.data] });
      // });
      axios.get("/products/products").then((res) => {
        console.log(res);
        this.setState({
          products: [...res.data.Products],
        });
        console.log("Product: ", this.state.products);
      });
      axios.get("/sales").then((res) => {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].id = i + 1;
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
                  progress: 50,
                });
              } else {
                res.data[i].Measuring_Unit = "problem loading Measuring Unit";
                this.setState({
                  data: [...res.data],
                  progress: 50,
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
                  progress: 80,
                });
              } else {
                res.data[i].Product_Name = "problem loading";
                this.setState({
                  data: [...res.data],
                  progress: 80,
                });
              }
            });
          //end
          //Axios
          axios
            .post("/distributors/distributor", {
              _id: res.data[i].Distributor,
            })
            .then((Distributors) => {
              console.log(Distributors);
              if (Distributors.data.Distributor) {
                console.log(Distributors.data.Distributor[0].distributor_name);
                res.data[i].Distributor =
                  Distributors.data.Distributor[0].distributor_name;
                this.setState({
                  data: [...res.data],
                  progress: 100,
                  isLoading: false,
                });
              } else {
                res.data[i].Distributor = "problem loading Distributor";
                this.setState({
                  data: [...res.data],
                  progress: 100,
                  isLoading: false,
                });
              }
            });
          //end
        }
        // this.setState({
        //   data: [...res.data]
        // });
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
    // axios.get("/distributor").then(res => {
    //   console.log(res);
    //   this.setState({
    //     distributorlist: [...res.data.Distributors]
    //   });
    //   console.log("distributors : ", res.data.Distributors);
    // });
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
          Manage Sales
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
                this.setState({
                  fieldDisabled: {
                    Product_Name: false,
                    Product_ID: false,
                    Quantity: false,
                    Measuring_Unit: false,
                    Box_Id: false,
                    Selling_Date: false,
                    Distributor: false,
                    Payment_Type: false,
                    Price: false,
                    Final_Price: false,
                    Discount: false,
                    Advance: false,
                    Balance: false,
                    btnDisplay: "flex",
                    btnText: "Cancel",
                  },
                });
                this.OnEditHandler(event, rowData);
              },
            },
          ]}
          // editable={{
          //   onRowDelete: (oldData) =>
          //     axios
          //       .post("/sales/delete", {
          //         _id: oldData._id,
          //       })
          //       .then((Sales) => {
          //         console.log(Sales);
          //         if (Sales) {
          //           this.setState((prevState) => {
          //             const data = [...prevState.data];
          //             data.splice(data.indexOf(oldData), 1);
          //             return { ...prevState, data };
          //           });
          //         }
          //       }),
          // }}
          onRowClick={(event, rowData) => {
            this.setState({
              fieldDisabled: {
                Product_Name: true,
                Product_ID: true,
                Quantity: true,
                Measuring_Unit: true,
                Box_Id: true,
                Selling_Date: true,
                Distributor: true,
                Payment_Type: true,
                Price: true,
                Final_Price: true,
                Discount: true,
                Advance: true,
                Balance: true,
                btnDisplay: "none",
                btnText: "Close",
              },
            });
            this.OnEditHandler(event, rowData);
          }}
        />
        <Dialog open={this.state.openAdd} maxWidth="lg" fullWidth>
          <DialogContent>
            <AddSales
              cancel={() => {
                this.setState({
                  openAdd: false,
                });
                // this.handleClose();
              }}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={this.state.openEdit} maxWidth="lg" fullWidth>
          <DialogContent>
            <EditSales
              sales={this.EditData}
              disabled={this.state.fieldDisabled}
              ProductRecord={() => {
                let temp = [];
                this.state.products.map((product) => {
                  if (product._id === this.EditData.Product_Name) {
                    temp = product;
                  }
                  return null;
                });
                return temp;
              }}
              cancel={() => {
                this.setState({
                  openEdit: false,
                });
                // this.handleClose();
              }}
            />
          </DialogContent>
        </Dialog>
      </Box>
    );
  }
}
