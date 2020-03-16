import React, { Component } from "react";
import { Box, TextField, Button } from "@material-ui/core";
// import { PaperBoard } from "../../Common_Files/PaperBoard/PaperBoard";
import axios from "axios";
import Styles from "../styles/FormStyles";
import { Datepick } from "../../../Components/Date/Datepick";

const styles = Styles;
export default class EditMethod extends Component {
  constructor(props) {
    super();
    this.state = {
      _id: "",
      Method_Name: "",
      Value: false,
      description: "",
      errors: [],
      //   fieldError: {
      //     measuring_unit_name: { status: false, msg: "" },
      //     description: { status: false, msg: "" }
      //   },
      isValid: false
    };
    this.onEditHandler = () => {
      axios
        .post("/qc-method/edit", {
          _id: this.state._id,
          Method_Name: this.state.Method_Name,
          Value: this.state.Value,

          Description: this.state.Description
        })
        .then(res => {
          console.log(res);
          this.props.cancel();
          // if (res.data.errors) {
          //   if (res.data.errors.length > 0) {
          // console.log(res.data.errors);
          // this.setState({
          //   isValid: false,
          //   errors: [...res.data.errors]
        });
      // } else {

      //   }
      // }
      // });
      // .catch(err => console.log(err));
    };
  }
  componentDidMount() {
    // if (permissionCheck(this.props, "Manage Measuring Units")) {
    //   console.log(this.props);
    if (this.state.Method_Name === "") {
      this.setState({
        Method_Name: this.props.Method.Method_Name,
        Value: this.props.Method.Value,
        Description: this.props.Method.Description,
        _id: this.props.Method._id
      });
    }
    // }
  }
  render() {
    return (
      <Box style={styles.box}>
        <Box fontSize="30px" mb={3}>
          Edit Method
        </Box>
        {this.state.errors.length > 0 ? (
          this.state.errors.map((error, index) => {
            return (
              <Box style={styles.box_msg} bgcolor="#f73067" key={index}>
                {error}
              </Box>
            );
          })
        ) : this.state.success === true ? (
          <Box bgcolor="#3df45b" style={styles.box_msg}>
            Registration Successful
          </Box>
        ) : null}
        {/* <PaperBoard> */}
        <Box style={styles.box_field}>
          <TextField
            name="Method_Name"
            size="small"
            fullWidth
            required
            value={this.state.Method_Name}
            variant="outlined"
            label="Method Name"
            type="text"
            onChange={event => {
              this.setState({
                Method_Name: event.target.value
              });
              // const { status, msg, isValid } = errorCheck(event);
              // this.setState(prevState => {
              //   prevState.fieldError.measuring_unit_name.status = status;
              //   prevState.fieldError.measuring_unit_name.msg = msg;
              //   prevState.isValid = isValid;
              // });
            }}
            // error={this.state.fieldError.measuring_unit_name.status}
            // helperText={this.state.fieldError.measuring_unit_name.msg}
          ></TextField>
        </Box>
        <Box style={styles.box_field}>
          <TextField
            name="Value"
            fullWidth
            size="small"
            required
            value={this.state.Value}
            variant="outlined"
            label="Value"
            type="text"
            onChange={event => {
              this.setState({
                Value: event.target.value
              });
              console.log(event);
            }}
          ></TextField>
        </Box>
        <Box style={styles.box_field}>
          <TextField
            name="Description"
            size="small"
            multiline
            rowsMax={4}
            fullWidth
            required
            value={this.state.Description}
            variant="outlined"
            label="Description"
            type="text"
            onChange={event => {
              this.setState({
                Description: event.target.value
              });
            }}
          ></TextField>
        </Box>
        {/* </PaperBoard> */}
        <Box
          display=" flex"
          marginTop="20px"
          justifyContent="flex-end"
          width="94%"
        >
          <Box marginRight="10px" width="100px">
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                this.props.cancel();
              }}
            >
              Cancel
            </Button>
          </Box>
          <Box width="100px">
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              //   disabled={!this.state.isValid}
              onClick={this.onEditHandler}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
}
