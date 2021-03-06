import React, { Component } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  LinearProgress,
} from "@material-ui/core";
// import PaperBoard from "../../../Common_Files/PaperBoard/PaperBoard";
import axios from "axios";
import Styles from "../../styles/FormStyles";
import { Datepick } from "../../../../Components/Date/Datepick";
import Autocomplete from "@material-ui/lab/Autocomplete";

const styles = Styles;
const style = {
  marginRight: "6px",
  marginLeft: "6px",
};
export default class Edit_RM_Request extends Component {
  constructor(props) {
    super();
    this.state = {
      _id: "",
      Raw_Material_Id: "Raw_material_Id",
      Raw_Material_Code: "",
      Quantity: "",
      Measuring_Unit: "",
      Priority: "",
      Due_Date: null,
      Status: "Requesting",
      Comments: "",
      errors: [],
      success: false,
      measuring_units: [],
      materials: [],
      code: "",
      subdisplay: false,
      progress: true,
      MaterialRecord: [],
    };
    this.onEditHandler = () => {
      if (
        // this.state.Raw_Material_Id !== "" &&
        this.state.Quantity !== "" &&
        this.state.Priority !== "" &&
        this.state.Due_Date !== null
      ) {
        this.setState({
          subdisplay: true,
          progress: true,
        });
        axios
          .post("/request-details/edit", {
            _id: this.state._id,
            Raw_Material_Id: this.state.Raw_Material_Id,
            Raw_Material_Code: this.state.Raw_Material_Code,
            Quantity: this.state.Quantity,
            Measuring_Unit: this.state.Measuring_Unit,
            Priority: this.state.Priority,
            Due_Date: this.state.Due_Date,
            Status: this.state.Status,
            Comments: this.state.Comments,
            logs: {
              from: "Production",
              to: "Purchase",
              comments: this.state.Comments,
            },
            Qoutation_Document_URL: [],
          })
          .then((res) => {
            this.setState({
              progress: true,
            });
            this.props.cancel();
          })
          .catch((err) => console.log(err));
      } else {
        alert("Please check all the fields are entered properly");
      }
    };
  }
  componentDidMount() {
    // if (this.state.Wastage_Type === "") {

    axios.get("/raw-materials/raw-materials").then((res) => {
      console.log(res);
      this.setState({
        materials: [...res.data.RawMaterials],
      });
      axios.get("/measuring-units/measuring-units").then((res) => {
        console.log(res);
        this.setState({
          measuring_units: [...res.data.MeasuringUnits],
          progress: false,
        });
        this.setState({
          MaterialRecord: this.props.MaterialRecord(),

          _id: this.props.RMRequest._id,
          Raw_Material_Id: this.props.RMRequest.Raw_Material_Id,
          Raw_Material_Code: this.props.RMRequest.Raw_Material_Code,
          Quantity: this.props.RMRequest.Quantity,
          Measuring_Unit: this.props.RMRequest.Measuring_Unit,
          Priority: this.props.RMRequest.Priority,
          Due_Date: this.props.RMRequest.Due_Date,
          Status: this.props.RMRequest.Status,
          Comments: this.props.RMRequest.Comments,
        });
      });
    });
    // }
    //   onChange={event => {
    //     this.setState({ country_name: event.target.value });
    //   }}value={this.state.country_name}
  }
  render() {
    return (
      <Box style={styles.box}>
        <Box fontSize="30px" mb={3}>
          Edit Raw Material Request
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
            Successful
          </Box>
        ) : null}
        {/* <PaperBoard> */}
        <Box style={styles.root}>
          <Box display="flex" justifyContent="center">
            <Box style={styles.lbox}>
              <Box style={styles.form}>
                {this.state.progress === true ? (
                  <LinearProgress
                    color="primary"
                    variant="indeterminate"
                    style={{
                      marginLeft: "10px",
                      marginBottom: "10px",
                    }}
                  />
                ) : (
                  <Box></Box>
                )}
                <Box style={styles.boxSize2}>
                  <Box width="50%" style={style}>
                    <FormControl
                      required
                      variant="outlined"
                      fullWidth
                      size="small"
                    >
                      {/* <InputLabel
                        style={{
                          backgroundColor: "white",
                          paddingLeft: "2px",
                          paddingRight: "2px",
                        }}
                      >
                        Material Name
                      </InputLabel>
                      <Select
                        disabled={this.props.disabled.Raw_Material_Id}
                        variant="outlined"
                        required
                        name="Raw_Material_Id"
                        value={this.state.Raw_Material_Id}
                        onChange={(event) => {
                          let materialCode;
                          let Measuring;
                          this.state.materials.map((material) => {
                            if (material._id === event.target.value) {
                              materialCode = material.raw_material_code;
                              Measuring = material.raw_material_measuring_unit;
                              console.log("code: ", materialCode);
                            }
                            return null;
                          });
                          this.setState({
                            Raw_Material_Id: event.target.value,
                            Raw_Material_Code: materialCode,
                            Measuring_Unit: Measuring,
                          });
                        }}
                      >
                        {this.state.materials.map((material, index) => {
                          return (
                            <MenuItem
                              //selected
                              key={index}
                              value={material._id}
                            >
                              {material.raw_material_name}
                            </MenuItem>
                          );
                        })}
                        
                      </Select> */}
                      <Autocomplete
                        options={this.state.materials}
                        autoHighlight={true}
                        value={this.state.MaterialRecord}
                        getOptionLabel={(option) => option.raw_material_name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Raw Material"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        onChange={(event, value) => {
                          console.log("materialRecord:", value);
                          console.log(
                            "stateRecord:",
                            this.state.materialRecord
                          );
                          if (value !== null) {
                            this.setState({
                              materialRecord: value,
                              Raw_Material_Id: value._id,
                              Raw_Material_Code: value.raw_material_code,
                              Measuring_Unit: value.raw_material_measuring_unit,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Box>
                  <Box width="50%" style={style}>
                    <TextField
                      disabled
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Material_Code"
                      required
                      name="Material_Code"
                      value={this.state.Raw_Material_Code}
                      onChange={(event) => {
                        this.setState({
                          Material_Code: event.target.value,
                        });
                        console.log(event.target.value);
                      }}
                    ></TextField>
                  </Box>
                </Box>

                <Box style={styles.boxSize2}>
                  <Box width="50%" style={style}>
                    <TextField
                      disabled={this.props.disabled.Quantity}
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Quantity"
                      required
                      name="Quantity"
                      value={this.state.Quantity}
                      onChange={(event) => {
                        this.setState({
                          Quantity: event.target.value,
                        });
                      }}
                    ></TextField>
                  </Box>
                  <Box width="50%" style={style}>
                    <FormControl
                      required
                      variant="outlined"
                      fullWidth
                      size="small"
                    >
                      <InputLabel
                        style={{
                          backgroundColor: "white",
                          paddingLeft: "2px",
                          paddingRight: "2px",
                        }}
                      >
                        Measuring Unit
                      </InputLabel>
                      <Select
                        disabled={this.props.disabled.Measuring_Unit}
                        name="Measuring_Unit"
                        variant="outlined"
                        required
                        value={this.state.Measuring_Unit}
                        onChange={(event) => {
                          this.setState({
                            Measuring_Unit: event.target.value,
                          });
                          console.log(event.target.value);
                        }}
                      >
                        {this.state.measuring_units.map(
                          (measuring_unit, index) => {
                            return (
                              <MenuItem
                                selected
                                key={index}
                                value={measuring_unit._id}
                              >
                                {measuring_unit.measuring_unit_name}
                              </MenuItem>
                            );
                          }
                        )}
                        {/* <MenuItem value="Product Name" disabled>
                          ltr
                        </MenuItem>
                        <MenuItem value="Orange Juice">kg</MenuItem>
                        <MenuItem value="Apple Juice">Apple Juice</MenuItem> */}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Box style={styles.boxSize2}>
                  <Box width="50%" style={style}>
                    <FormControl
                      required
                      variant="outlined"
                      fullWidth
                      size="small"
                    >
                      <InputLabel
                        style={{
                          backgroundColor: "white",
                          paddingLeft: "2px",
                          paddingRight: "2px",
                        }}
                      >
                        Priority
                      </InputLabel>
                      <Select
                        disabled={this.props.disabled.Priority}
                        variant="outlined"
                        required
                        name="Priority"
                        value={this.state.Priority}
                        onChange={(event) => {
                          this.setState({
                            Priority: event.target.value,
                          });
                        }}
                      >
                        <MenuItem value="Priority" disabled>
                          Priority
                        </MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box width="50%" style={style}>
                    <Datepick
                      disabled={this.props.disabled.Due_Date}
                      id="4"
                      variant="outlined"
                      Name="Due_Date"
                      value={this.state.Due_Date}
                      setDate={(date) => {
                        this.setState({
                          Due_Date: date,
                        });
                        console.log(date);
                      }}
                    />
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="100%" style={style}>
                    <TextField
                      disabled
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Status"
                      required
                      name="Status"
                      value={this.state.Status}
                      onChange={(event) => {
                        this.setState({
                          Status: event.target.value,
                        });
                      }}
                    ></TextField>
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="100%" style={style}>
                    <TextField
                      disabled={this.props.disabled.Comments}
                      size="small"
                      multiline
                      rowsMax="3"
                      variant="outlined"
                      fullWidth
                      label="Comments"
                      value={this.state.Comments}
                      onChange={(event) => {
                        this.setState({
                          Comments: event.target.value,
                        });
                        console.log(event.target.value);
                      }}
                    ></TextField>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* </PaperBoard> */}
        <Box
          display=" flex"
          pt={2}
          pb={2}
          m={0}
          justifyContent="flex-end"
          width="87%"
        >
          <Box display=" flex">
            <Button
              variant="contained"
              color="primary"
              size="large"
              fontWeight="Bold"
              onClick={() => {
                this.props.cancel();
              }}
            >
              {this.props.disabled.btnText}
            </Button>
          </Box>
          <Box marginLeft="10px" display={this.props.disabled.btnDisplay}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fontWeight="bold"
              onClick={this.onEditHandler}
              disabled={this.state.subdisplay}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
}
