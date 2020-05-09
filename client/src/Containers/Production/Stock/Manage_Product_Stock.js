import React, { Component } from "react";
import MaterialTable from "material-table";
import { LinearProgress } from "@material-ui/core";

import { Box } from "@material-ui/core";
import axios from "axios";

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
          field: "Quantity",
        },
        {
          title: "Measuring Unit",
          field: "Measuring_Unit",
        },
      ],
      data: [],
      openAdd: false,
      openEdit: false,
      msg: "Fetching Data...",
      isLoading: true,
      progress: 0,
    };

    this.handleClose = () => {
      axios.get("/production-stock/stock").then((res) => {
        console.log("hello", res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].id = i + 1;
          console.log("hello", res.data);
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
                console.log("hello", res.data);
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
        <Box fontSize="30px" mb={8}>
          Production Stock
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
          // editable={{
          //   onRowDelete: (oldData) =>
          //     axios
          //       .post("/production-stock/delete", {
          //         _id: oldData._id,
          //       })
          //       .then((Production) => {
          //         console.log(Production);
          //         if (Production) {
          //           this.setState((prevState) => {
          //             const data = [...prevState.data];
          //             data.splice(data.indexOf(oldData), 1);
          //             return { ...prevState, data };
          //           });
          //         }
          //       }),
          // }}
        />
      </Box>
    );
  }
}
