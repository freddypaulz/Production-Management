import React, { Component } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox
} from "@material-ui/core";
// import PaperBoard from "../../Common_Files/PaperBoard/PaperBoard";
import axios from "axios";
import Styles from "../../styles/FormStyles";
import { Datepick } from "../../Common_Files/Date/Datepick";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const styles = Styles;
const style = {
  marginRight: "6px",
  marginLeft: "6px"
};
export default class Qualitycheck extends Component {
  constructor(props) {
    super();
    this.state = {
      _id: "",
      QC_Type: "",
      Product_Name: "",
      Product_ID: "",
      Measuring_Unit: "",
      Quantity: "",
      Id_Type: "",
      Id: "",
      Box_Id: "",
      I_Capacity: "",
      B_Capacity: "",
      Method: [],
      QC_Date: null,
      Result: "",
      Comments: "",
      Status: "",
      products: [],
      errors: [],
      measuring_units: [],
      methods: [],
      lastid: "",
      lastvalue: "",
      boxlastid: "",
      prefixcode: "",
      boxprefixcode: "",
      boxcodes: []
    };
    this.onEditHandler = () => {
      axios
        .post("/quality-check/edit", {
          _id: this.state._id,
          QC_Type: this.state.QC_Type,
          Product_Name: this.state.Product_Name,
          Product_ID: this.state.Product_ID,
          Measuring_Unit: this.state.Measuring_Unit,
          Quantity: this.state.Quantity,
          Method: this.state.Method,
          Id_Type: this.state.Id_Type,
          Id: this.state.Id,
          Box_Id: this.state.Box_Id,
          I_Capacity: this.state.I_Capacity,
          B_Capacity: this.state.B_Capacity,
          QC_Date: this.state.QC_Date,
          Result: this.state.Result,
          Comments: this.state.Comments,
          Status: this.state.Status
        })
        .then(res => {
          console.log(res.data);
          // if (res.data.errors) {
          //   if (res.data.errors.length > 0) {
          //     console.log(res.data.errors);
          //     this.setState({
          //       errors: [...res.data.errors],
          //       success: false
          //     });
          //   } else {
          this.props.cancel();
          //   }
          // }
        })
        .catch(err => console.log(err));
    };
  }
  componentDidMount() {
    // if (this.state.Wastage_Type === "") {
    axios.get("/measuring-unit/measuring-units").then(res => {
      console.log(res);
      this.setState({
        measuring_units: [...res.data.MeasuringUnits]
      });
      axios.get("/products/products").then(res => {
        console.log(res);
        this.setState({
          products: [...res.data.Products]
        });
        // console.log("Product: ", this.state.products);
      });
      axios.get("/qc-method").then(res => {
        console.log("qc----", res);
        this.setState({
          methods: [...res.data]
        });
        // console.log("Product: ", this.state.products);
      });
    });
    axios.get("/product-code").then(res => {
      console.log("productcodes", res.data.ProductCode);
      this.setState({
        productcodes: [...res.data.ProductCode],
        prefixcode:
          res.data.ProductCode[0].code_prefix +
          res.data.ProductCode[0].code_separator
      });
    });
    axios.get("/box-code").then(res => {
      console.log("boxcodes", res.data.BoxCode);
      this.setState({
        boxcodes: [...res.data.BoxCode],
        boxprefixcode:
          res.data.BoxCode[0].code_prefix + res.data.BoxCode[0].code_separator
      });
      console.log(
        "concode:",
        res.data.BoxCode[0].code_prefix + res.data.BoxCode[0].code_separator
      );
    });
    axios.get("/quality-check/lastcode").then(res => {
      console.log("Lastcodes", res);

      if (res.data.length !== 0) {
        this.setState({
          lastid: res.data.Id[res.data.Id.length - 1].split("-")[1]
        });
      }
      console.log("Lastid", this.state.lastid);
    });
    axios.get("/quality-check/blcode").then(res => {
      console.log("BoxLastcodes", res);
      console.log("boxid", res.data.Box_Id);
      if (res.data.length !== 0) {
        this.setState({
          boxlastid: res.data.Box_Id[res.data.Box_Id.length - 1].split("-")[1]
        });
      }
      console.log("boxLastid", this.state.boxlastid);
    });
    this.setState({
      _id: this.props.qualitycheck._id,
      QC_Type: this.props.qualitycheck.QC_Type,
      Product_Name: this.props.qualitycheck.Product_Name,
      Product_ID: this.props.qualitycheck.Product_ID,
      Quantity: this.props.qualitycheck.Quantity,
      Id_Type: this.props.qualitycheck.Id_Type,
      Id: this.props.qualitycheck.Id,
      Box_Id: this.props.qualitycheck.Box_Id,
      I_Capacity: this.props.qualitycheck.I_Capacity,
      B_Capacity: this.props.qualitycheck.B_Capacity,
      Measuring_Unit: this.props.qualitycheck.Measuring_Unit,
      Method: this.props.qualitycheck.Method,
      QC_Date: this.props.qualitycheck.QC_Date,
      Result: this.props.qualitycheck.Result,
      Comments: this.props.qualitycheck.Comments,
      Status: this.props.qualitycheck.Status
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
          Quality Check
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
                <Box style={styles.boxSize2}>
                  <Box width="100%" style={style}>
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
                        Qualitycheck Type
                      </InputLabel>
                      <Select
                        disabled={this.props.disabled.QC_Type}
                        variant="outlined"
                        required
                        name="QC_Type"
                        value={this.state.QC_Type}
                        onChange={event => {
                          this.setState({ QC_Type: event.target.value });
                        }}
                      >
                        <MenuItem value="Qualitycheck Type" disabled>
                          Qualitycheck Type
                        </MenuItem>
                        <MenuItem value="Product">Product</MenuItem>
                        <MenuItem value="Packing">Packing</MenuItem>
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
                          paddingRight: "2px"
                        }}
                      >
                        Item Name
                      </InputLabel>
                      <Select
                        disabled={this.props.disabled.Product_Name}
                        variant="outlined"
                        required
                        name="Product_Name"
                        value={this.state.Product_Name}
                        onChange={event => {
                          let prodCode;
                          this.state.products.map(product => {
                            if (product._id === event.target.value) {
                              prodCode = product.product_code;
                              console.log("Procode: ", prodCode);
                            }
                          });
                          this.setState({
                            Product_Name: event.target.value,
                            Id: prodCode
                          });
                        }}
                      >
                        {this.state.products.map((product, index) => {
                          return (
                            <MenuItem
                              //selected
                              key={index}
                              value={product._id}
                            >
                              {product.product_name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box width="50%" style={style}>
                    <TextField
                      disabled={this.props.disabled.Product_ID}
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Product_ID"
                      required
                      name="Product_ID"
                      value={this.state.Product_ID}
                      onChange={event => {
                        this.setState({
                          Product_ID: event.target.value
                        });
                        console.log(event.target.value);
                      }}
                    ></TextField>
                  </Box>
                </Box>

                <Box style={styles.boxSize2}>
                  <Box width="50%" style={style} mb={0} mt={0.5}>
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
                    {/* */}
                  </Box>
                  <Box width="50%" style={style} mb={0} mt={0.5}>
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
                        {/* <MenuItem value="Measuring Unit" disabled>
                            Measuring Unit
                          </MenuItem>
                          <MenuItem value="kg">kg</MenuItem>
                          <MenuItem value="ltr">ltr</MenuItem>
                          <MenuItem value="Box">Box</MenuItem> */}
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

                <Box style={styles.boxSize2}>
                  <Box width="50%" style={style} mb={0} mt={0.5}>
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
                  <Box width="50%" style={style} mb={0} mt={0.5}>
                    <TextField
                      disabled={this.props.disabled.B_Capacity}
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Box Capacity"
                      required
                      name="B_Capacity"
                      value={this.state.B_Capacity}
                      onChange={event => {
                        this.setState({ B_Capacity: event.target.value });

                        let cap = [];
                        let cal;
                        for (let i = 1; i <= event.target.value; i++) {
                          cal =
                            this.state.boxprefixcode +
                            (parseInt(this.state.boxlastid) + i);
                          cap.push(cal);
                        }
                        this.setState({ Box_Id: cap });
                        console.log("ids", cap);
                        // }
                      }}
                    ></TextField>
                  </Box>
                  <Box width="50%" style={style} mb={0} mt={0.5}>
                    <TextField
                      disabled={this.props.disabled.I_Capacity}
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Indivitual Capacity"
                      required
                      name="I_Capacity"
                      value={this.state.I_Capacity}
                      onChange={event => {
                        this.setState({ I_Capacity: event.target.value });

                        let temp = [];
                        let calc;
                        for (let i = 1; i <= this.state.I_Capacity; i++) {
                          calc =
                            this.state.prefixcode +
                            (parseInt(this.state.lastid) + i);
                          temp.push(calc);
                        }
                        this.setState({ Id: temp });
                        console.log("ids", temp);
                        // }
                      }}
                    ></TextField>
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="100%" style={style} mb={0} mt={0.5}>
                    <TextField
                      disabled={this.props.disabled.Box_Id}
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Box Id"
                      required
                      name="Box_Id"
                      value={this.state.Box_Id}
                      onChange={event => {
                        this.setState({
                          Box_Id: event.target.value
                        });
                      }}
                    ></TextField>
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="100%" style={style} mb={0} mt={0.5}>
                    <TextField
                      disabled={this.props.disabled.Id}
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Individual Id"
                      required
                      name="Id"
                      value={this.state.Id}
                      onChange={event => {
                        this.setState({ Id: event.target.value });
                      }}
                    ></TextField>
                  </Box>
                </Box>

                <Box style={styles.boxSize2}>
                  <Box width="100%" style={style}>
                    <Datepick
                      disabled={this.props.disabled.QC_Date}
                      id="4"
                      variant="outlined"
                      Name="QC_Date"
                      value={this.state.QC_Date}
                      setDate={date => {
                        this.setState({
                          QC_Date: date
                        });
                      }}
                    />
                  </Box>
                </Box>
                <Box style={style}>
                  <h4>Testing Methods:</h4>
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    maxHeight="200px"
                    overflow="auto"
                    border="1px solid #cfcccc"
                    padding="5px"
                    marginLeft="5px"
                    borderRadius="4px"
                    alignSelf="center"
                    style={style}
                  >
                    {this.state.methods.map((method, index) => {
                      return (
                        <Box display="flex" key={index}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="Method"
                                value={this.state.Method}
                                checked={method.Value}
                                onClick={event => {
                                  method.Value = !method.Value;
                                  this.setState({
                                    methods: [...this.state.methods],
                                    Method: event.target.checked
                                  });
                                  console.log(this.state.methods);
                                }}
                                Value={`${method.Value}`}
                              />
                            }
                            label={`${method.Method_Name}`}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="100%" style={style}>
                    <h4>Status:</h4>
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
                        Result Status
                      </InputLabel>
                      <Select
                        disabled={this.props.disabled.Result}
                        variant="outlined"
                        required
                        name="Result"
                        value={this.state.Result}
                        onChange={event => {
                          this.setState({
                            Result: event.target.value
                          });
                        }}
                      >
                        <MenuItem value="Result Status" disabled>
                          Result Status
                        </MenuItem>
                        <MenuItem value="Pass">Pass</MenuItem>
                        <MenuItem value="Fail">Fail</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box
                    style={style}
                    mb={0}
                    mt={1}
                    display="flex"
                    alignItems="center"
                    width="100%"
                  >
                    <TextField
                      disabled={this.props.disabled.Comments}
                      size="small"
                      multiline
                      variant="outlined"
                      fullWidth
                      // placeholder="comments"
                      label="Comments"
                      rowsMax="3"
                      name="Comments"
                      value={this.state.Comments}
                      onChange={event => {
                        this.setState({ Comments: event.target.value });
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
              fontWeight="Bold"
              onClick={() => {
                this.props.cancel();
              }}
            >
              Cancel
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
              update
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
}
