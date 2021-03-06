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
import axios from "axios";
import Styles from "../../styles/FormStyles";
import { Datepick } from "../../../../Components/Date/Datepick";
import Autocomplete from "@material-ui/lab/Autocomplete";

const styles = Styles;
const style = {
  marginRight: "6px",
  marginLeft: "6px",
};
export default class EditProduction extends Component {
  constructor(props) {
    super();
    this.state = {
      _id: "",
      Product_Name: "Product_Name",
      Product_ID: "Product_ID",
      Batch_Id: "",
      Quantity: " Quantity",
      Measuring_Unit: "Measuring_Unit",
      Expiry_Duration_Days: "",
      Status: "",
      Manufacture_Date: null,
      errors: [],
      success: false,
      measuring_units: [],
      products: [],
      code: "",
      subdisplay: false,
      progress: true,
      ProductRecord: [],
    };
    this.onEditHandler = () => {
      if (
        // this.state.Product_Name !== "" &&
        this.state.Quantity !== "" &&
        this.state.Batch_Id !== "" &&
        this.state.Manufacture_Date !== "" &&
        this.state.Expiry_Duration_Days !== ""
      ) {
        this.setState({
          subdisplay: true,
          progress: true,
        });
        axios
          .post("/production/edit", {
            _id: this.state._id,
            Product_ID: this.state.Product_ID,
            Product_Name: this.state.Product_Name,
            Batch_Id: this.state.Batch_Id,
            Quantity: this.state.Quantity,
            Status: this.state.Status,
            Measuring_Unit: this.state.Measuring_Unit,
            Expiry_Duration_Days: this.state.Expiry_Duration_Days,
            Manufacture_Date: this.state.Manufacture_Date,
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
    axios.get("/measuring-units/measuring-units").then((res) => {
      console.log(res);
      this.setState({
        measuring_units: [...res.data.MeasuringUnits],
      });
    });
    axios.get("/products/products").then((res) => {
      console.log(res);
      this.setState({
        products: [...res.data.Products],
        progress: false,
      });
      // console.log("Product: ", this.state.products);
    });

    this.setState({
      ProductRecord: this.props.ProductRecord(),

      _id: this.props.Production._id,
      Product_ID: this.props.Production.Product_ID,
      Product_Name: this.props.Production.Product_Name,
      Batch_Id: this.props.Production.Batch_Id,
      Quantity: this.props.Production.Quantity,
      Status: this.props.Production.Status,
      Measuring_Unit: this.props.Production.Measuring_Unit,
      Expiry_Duration_Days: this.props.Production.Expiry_Duration_Days,
      Manufacture_Date: this.props.Production.Manufacture_Date,
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
          Edit Production
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
                        Product Name
                      </InputLabel>
                      <Select
                        disabled={this.props.disabled.Product_Name}
                        variant="outlined"
                        required
                        name="Product_Name"
                        value={this.state.Product_Name}
                        onChange={(event) => {
                          let prodCode;
                          this.state.products.map((product) => {
                            if (product._id === event.target.value) {
                              prodCode = product.product_code;
                              console.log("Procode: ", prodCode);
                            }
                            return null;
                          });
                          this.setState({
                            Product_Name: event.target.value,
                            Product_ID: prodCode,
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
                          <MenuItem value="Product Name" disabled>
                            Product Name
                          </MenuItem>
                          <MenuItem value="Orange Juice">Orange Juice</MenuItem>
                          <MenuItem value="Apple Juice">Apple Juice</MenuItem>  
                      </Select> */}
                      <Autocomplete
                        options={this.state.products}
                        autoHighlight={true}
                        value={this.state.ProductRecord}
                        getOptionLabel={(option) => option.product_name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Product Name"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        onChange={(event, value) => {
                          if (value !== null) {
                            this.setState({
                              ProductRecord: value,
                              Product_Name: value._id,
                              Product_ID: value.product_code,
                              Measuring_Unit: value.product_measuring_unit,
                            });
                          }

                          console.log("Product:", value);
                        }}
                      />
                    </FormControl>
                  </Box>
                  <Box width="50%" style={style}>
                    <TextField
                      disabled
                      // ={this.props.disabled.Product_ID}
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Product_ID"
                      required
                      name="Product_ID"
                      value={this.state.Product_ID}
                      onChange={(event) => {
                        this.setState({
                          Product_ID: event.target.value,
                        });
                        console.log(event.target.value);
                      }}
                    ></TextField>
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="100%" style={style}>
                    <TextField
                      disabled={this.props.disabled.Batch_Id}
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Batch_Id"
                      required
                      name="Batch_Id"
                      value={this.state.Batch_Id}
                      onChange={(event) => {
                        this.setState({
                          Batch_Id: event.target.value,
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
                        disabled
                        // ={this.props.disabled.Measuring_Unit}
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
                        {/* <MenuItem value="unit" disabled>
                            unit
                          </MenuItem>
                          <MenuItem value="kg">kg</MenuItem>
                          <MenuItem value="box">box</MenuItem> */}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Box style={styles.boxSize2}>
                  <Box width="50%" style={style}>
                    <TextField
                      disabled={this.props.disabled.Expiry_Duration_Days}
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Expiry_Duration_Days"
                      required
                      name="Expiry_Duration_Days"
                      value={this.state.Expiry_Duration_Days}
                      onChange={(event) => {
                        this.setState({
                          Expiry_Duration_Days: event.target.value,
                        });
                        console.log(event.target.value);
                      }}
                    ></TextField>
                  </Box>
                  <Box width="50%" style={style}>
                    <Datepick
                      disabled={this.props.disabled.Manufacture_Date}
                      id="4"
                      variant="outlined"
                      Name="Manufacture_Date"
                      value={this.state.Manufacture_Date}
                      setDate={(date) => {
                        this.setState({
                          Manufacture_Date: date,
                        });
                        console.log(date);
                      }}
                    />
                  </Box>
                </Box>
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
                          paddingRight: "2px",
                        }}
                      >
                        Status
                      </InputLabel>
                      <Select
                        name="Status"
                        variant="outlined"
                        required
                        value={this.state.Status}
                        onChange={(event) => {
                          this.setState({
                            Status: event.target.value,
                          });
                          console.log(event.target.value);
                        }}
                      >
                        <MenuItem value="Status " disabled></MenuItem>
                        <MenuItem value="Ready to Product QC">
                          Ready to Product QC
                        </MenuItem>
                        <MenuItem value="Ready to Packing QC">
                          Ready to Packing QC
                        </MenuItem>
                        <MenuItem value="Ready For QC">Ready For QC</MenuItem>
                      </Select>
                    </FormControl>
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
