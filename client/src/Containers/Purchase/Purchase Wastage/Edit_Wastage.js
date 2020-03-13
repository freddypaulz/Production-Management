import React, { Component } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from "@material-ui/core";
import axios from "axios";
import Styles from "./styles/FormStyles";
import { Datepick } from "./Date/Datepick";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

const styles = Styles;
const style = {
  marginRight: "6px",
  marginLeft: "6px"
};
export default class EditWastage extends Component {
  constructor(props) {
    super();
    this.state = {
      _id: "",
      Product_Name: "",
      Raw_Material_Id: "",
      Quantity: "",
      Raw_Material_Code: "",
      Id_Type: "",
      Id: [{ id: "" }],
      Measuring_Unit: "",
      Wastage_Date: "",
      Description: "",
      errors: [],
      materials: [],
      products: [],
      measuring_units: [],
      A_Id: ""
    };
    this.onEditHandler = () => {
      axios
        .post("/wastage/edit", {
          _id: this.state._id,
          Wastage_Type: this.state.Wastage_Type,
          Product_Name: this.state.Product_Name,
          Raw_Material_Id: this.state.Raw_Material_Id,
          Quantity: this.state.Quantity,
          Product_ID: this.state.Product_ID,
          Raw_Material_Code: this.state.Raw_Material_Code,
          Id_Type: this.state.Id_Type,
          Id: this.state.Id,
          Measuring_Unit: this.state.Measuring_Unit,
          Wastage_Date: this.state.Wastage_Date,
          Description: this.state.Description
        })
        .then(res => {
          console.log(res.data);
          this.props.cancel();
        })
        .catch(err => console.log(err));
    };
  }
  componentDidMount() {
    axios.get("/measuring-unit").then(res => {
      console.log(res);
      this.setState({
        measuring_units: [...res.data.MeasuringUnits]
      });
    });
    axios.get("/raw-material").then(res => {
      console.log(res);
      this.setState({
        materials: [...res.data.RawMaterials],
        Raw_Material_Id: this.props.wastage.Raw_Material_Id
      });
    });
    this.setState({
      Wastage_Type: this.props.wastage.Wastage_Type,
      Quantity: this.props.wastage.Quantity,
      Product_ID: this.props.wastage.Product_ID,
      Raw_Material_Code: this.props.wastage.raw_material_code,
      Id_Type: this.props.wastage.Id_Type,
      Id: this.props.wastage.Id,
      Measuring_Unit: this.props.wastage.Measuring_Unit,
      Wastage_Date: this.props.wastage.Wastage_Date,
      Description: this.props.wastage.Description,
      _id: this.props.wastage._id
    });
  }
  render() {
    return (
      <Box style={styles.box}>
        <Box fontSize="30px" mb={3}>
          Edit Wastage
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
        <Box style={styles.root}>
          <Box display="flex" justifyContent="center">
            <Box style={styles.lbox}>
              <Box style={styles.form}>
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
                          paddingRight: "2px"
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
                        onChange={event => {
                          let materialCode;
                          this.state.materials.map(material => {
                            if (material._id === event.target.value) {
                              materialCode = material.raw_material_code;
                              console.log("code: ", materialCode);
                            }
                          });
                          this.setState({
                            Raw_Material_Id: event.target.value,
                            Raw_Material_Code: materialCode
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
                      </Select>
                    </FormControl>
                  </Box>
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
                      onChange={event => {
                        this.setState({ Quantity: event.target.value });
                      }}
                    ></TextField>
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
                          paddingRight: "2px"
                        }}
                      >
                        Id Type
                      </InputLabel>
                      <Select
                        disabled={this.props.disabled.Id_Type}
                        variant="outlined"
                        required
                        name="Id_Type"
                        value={this.state.Id_Type}
                        onChange={event => {
                          this.setState({ Id_Type: event.target.value });
                        }}
                      >
                        <MenuItem value="Id Type" disabled>
                          Id Type
                        </MenuItem>
                        <MenuItem value="Individual">Individual</MenuItem>
                        <MenuItem value="Box">Box</MenuItem>
                      </Select>
                    </FormControl>
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
                          paddingRight: "2px"
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
                        onChange={event => {
                          this.setState({
                            Measuring_Unit: event.target.value
                          });
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
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Box style={styles.boxSize2} >
                  <Box
                    width="100%"
                    style={style}
                    flexDirection="row"
                    display="flex"
                    flexWrap="wrap"
                    overflow='auto'
                    maxHeight='100px'
                  >
                    {this.state.Id.map((poc, index) => {
                      return (
                        <Box display="flex" width='33.33%' pt={1} >
                          <TextField
                            size="small"
                            fullWidth
                            variant="outlined"
                            label="Id"
                            required
                            name="Id"
                            value={this.state.Id[index].id}
                            disabled={this.props.disabled.Id}
                            onFocus={() => {
                              console.log("wiiid:", this.state.Id[index].Id);
                            }}
                            onChange={event => {
                              this.setState({
                                A_Id: event.target.value
                              });
                              console.log(event.target.value);
                              this.setState(prevState => {
                                prevState.Id[index].id = prevState.A_Id;

                                console.log(prevState.Id[index]);
                              });
                            }}
                          ></TextField>

                          {this.state.Id.length === index + 1 ? (
                            <AddBoxOutlinedIcon
                              color="secondary"
                              style={{
                                fontSize: "30px",
                                margin: "4px",
                                padding: "0px",
                              }}
                              onClick={() => {
                                this.setState({});
                                this.setState(prevState => {
                                  prevState.Id.push({
                                    id: ""
                                  });
                                  console.log(prevState.Id);
                                });
                              }}
                            />
                          ) : (
                              <DeleteOutlineIcon
                                color="secondary"
                                style={{
                                  fontSize: "30px",
                                  margin: "4px",
                                  padding: "0px"
                                }}
                                onClick={() => {
                                  this.setState({});
                                  this.setState(prevState => {
                                    prevState.Id.splice(index, 1);
                                    console.log(prevState.Id);
                                  });
                                }}
                              />
                            )}
                        </Box>
                      );
                    }).reverse()}
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="100%" style={style}>
                    <Datepick
                      disabled={this.props.disabled.Wastage_Date}
                      id="4"
                      variant="outlined"
                      name="Wastage Date"
                      value={this.state.Wastage_Date}
                      onChange={event => {
                        this.setState({ Wastage_Date: event.target.value });
                      }}
                    />
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box
                    style={style}
                    display="flex"
                    alignItems="center"
                    width="100%"
                  >
                    <TextField
                      disabled={this.props.disabled.Description}
                      size="small"
                      multiline
                      rowsMax="3"
                      variant="outlined"
                      fullWidth
                      label="Reasons"
                      value={this.state.Description}
                      onChange={event => {
                        this.setState({ Description: event.target.value });
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
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              style={{ fontWeight: 'bold' }}
              onClick={() => {
                this.props.cancel();
              }}
            >
              close
            </Button>
          </Box>
          <Box marginLeft="10px" display={this.props.disabled.btnDisplay}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              fontWeight="bold"
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
