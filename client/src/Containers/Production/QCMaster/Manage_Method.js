import React, { Component } from "react";
import MaterialTable from "material-table";
import { Box, Button, DialogContent } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import axios from "axios";
// import permissionCheck from "../../Components/Auth/permissionCheck";
import AddMethod from "./Add_Method";
import EditMethod from "./Edit_Method";

export default class ManageMethod extends Component {
  constructor(props) {
    super();
    this.EditData = {};
    this.state = {
      columns: [
        { title: "ID", field: "id" },
        { title: "Method Name", field: "Method_Name" },
        { title: "Value", field: "Value" },
        { title: "Description", field: "Description" }
      ],
      data: [],
      openAdd: false,
      openEdit: false,
      openUploadCSV: false
    };
    this.OnEditHandler = (event, rowData) => {
      axios
        .post("/qc-method", {
          _id: rowData._id
        })
        .then(res => {
          console.log(res);
          this.EditData = { ...res.data[0] };
          console.log(this.EditData);
          this.setState({
            openEdit: true
          });
        });
    };
    this.handleClose = () => {
      axios.get("/qc-method").then(res => {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].id = i + 1;
        }
        this.setState({
          data: [...res.data]
        });
      });
    };
  }
  componentDidMount() {
    // if (permissionCheck(this.props, "Manage Measuring Units")) {
    this.handleClose();
    // }
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
          Manage Method
        </Box>
        <Box width="90%" display="flex" flexDirection="row">
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
              color: "#FFF"
            }
          }}
          actions={[
            {
              icon: "edit",
              tooltip: "Edit User",
              onClick: (event, rowData) => {
                this.OnEditHandler(event, rowData);
              }
            }
          ]}
          editable={{
            onRowDelete: oldData =>
              axios
                .post("/qc-method/delete", {
                  _id: oldData._id
                })
                .then(methods => {
                  console.log(methods);
                  if (methods) {
                    this.setState(prevState => {
                      const data = [...prevState.data];
                      data.splice(data.indexOf(oldData), 1);
                      return { ...prevState, data };
                    });
                  }
                })
          }}
          onRowClick={(event, rowData) => {
            this.OnEditHandler(event, rowData);
          }}
        />
        <Dialog open={this.state.openAdd} maxWidth="lg" fullWidth>
          <DialogContent style={{ padding: "20px" }}>
            <AddMethod
              cancel={() => {
                this.setState({
                  openAdd: false
                });
                this.handleClose();
              }}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={this.state.openEdit} maxWidth="lg" fullWidth>
          <DialogContent style={{ padding: "20px" }}>
            <EditMethod
              Method={this.EditData}
              cancel={() => {
                this.setState({
                  openEdit: false
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
