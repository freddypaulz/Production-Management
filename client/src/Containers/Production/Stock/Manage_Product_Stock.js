import React, { Component } from "react";
import MaterialTable from "material-table";
import { Box, Button, DialogContent } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import axios from "axios";
import EditProductStock from "./Edit_Product_Stock";

export default class ManageProductStock extends Component {
  constructor(props) {
    super();
    this.EditData = {};
    this.state = {
      columns: [
        { title: "Product ID", field: "Product_ID" },
        { title: "Product Name", field: "Product_Name" },
        {
          title: "Quantity",
          field: "Quantity"
        },
        {
          title: "Measuring Unit",
          field: "Measuring_Unit"
        }
      ],
      data: [],
      openAdd: false,
      openEdit: false
    };

    this.handleClose = () => {
      axios.get("/production-stock/stock").then(res => {
        console.log("hello", res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].id = i + 1;
          console.log("hello", res.data);
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
                console.log("hello", res.data);
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
              console.log(ProductName.data.Product[0].product_name);
              if (ProductName.data.Product) {
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
        width="80%"
        display="flex"
        alignItems="center"
        flexDirection="column"
        height="100vh"
      >
        <Box fontSize="30px" mb={8} fontWeight="bold ">
          Production Stock
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
          // editable={{
          //   onRowDelete: oldData =>
          //     axios
          //       .post("/production-stock/delete", {
          //         _id: oldData._id
          //       })
          //       .then(Production => {
          //         console.log(Production);
          //         if (Production) {
          //           this.setState(prevState => {
          //             const data = [...prevState.data];
          //             data.splice(data.indexOf(oldData), 1);
          //             return { ...prevState, data };
          //           });
          //         }
          //       })
          // }}
        />
      </Box>
    );
  }
}
