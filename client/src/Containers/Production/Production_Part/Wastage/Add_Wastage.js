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
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Autocomplete from "@material-ui/lab/Autocomplete";

const styles = Styles;
const style = {
  marginRight: "6px",
  marginLeft: "6px",
};
export default class AddWastage extends Component {
  constructor(props) {
    super();
    this.state = {
      // _id: "",
      Wastage_Type: "Product",
      Product_Name: "",
      Raw_Material_Id: "",
      Quantity: "",
      Product_ID: "",
      raw_material_code: "",
      Id_Type: "",
      Id: [{ id: "" }],
      Measuring_Unit: "",
      Wastage_Date: null,
      Description: "",
      Avilable_Stock: "",
      errors: [],
      openAdd: false,
      success: false,
      materials: [],
      products: [],
      material: [],
      productlist: [],
      measuring_units: [],
      materialRecord: [],
      ProductRecord: [],
      a_id: "",
      disable: true,
      subdisplay: false,
      progress: false,
    };
    this.onAddHandler = () => {
      if (
        this.state.materialRecord !== null &&
        this.state.Quantity !== "" &&
        this.state.Id_Type !== "" &&
        this.state.Id[0].id !== "" &&
        this.state.Wastage_Date !== null &&
        this.state.Description !== ""
      ) {
        this.setState({
          subdisplay: true,
          progress: true,
        });
        axios
          .post("/wastage/add", {
            // _id: this.state._id,
            Wastage_Type: this.state.Wastage_Type,
            Product_Name: this.state.Product_Name,
            Raw_Material_Id: this.state.Raw_Material_Id,
            Quantity: this.state.Quantity,
            Product_ID: this.state.Product_ID,
            raw_material_code: this.state.raw_material_code,
            Id_Type: this.state.Id_Type,
            Id: this.state.Id,
            Measuring_Unit: this.state.Measuring_Unit,
            Wastage_Date: this.state.Wastage_Date,
            Description: this.state.Description,
          })
          .then((res) => {
            this.setState({
              progress: true,
            });
            this.props.cancel();
          });
      } else {
        alert("Please check all the fields are entered properly");
      }
    };

    this.getMaterialName = (id) => {
      let temp = id;
      this.state.material.map((material) => {
        if (material._id === id) {
          temp = material.raw_material_name;
        }
        return null;
      });
      return temp;
    };
    this.getProductName = (id) => {
      let temp = id;
      this.state.productlist.map((product) => {
        if (product._id === id) {
          temp = product.product_name;
        }
        return null;
      });
      return temp;
    };
  }
  componentDidMount() {
    axios.get("/production-raw-material-stock").then((res) => {
      console.log("rmstock", res.data);
      this.setState({
        materials: [...res.data],
      });
    });
    axios.get("/production-stock/stock").then((res) => {
      console.log("products", res.data);
      this.setState({ products: [...res.data] });
    });
    axios.get("/raw-materials/raw-materials").then((res) => {
      console.log(res);
      this.setState({
        material: [...res.data.RawMaterials],
      });
    });
    // axios.get("/raw-material").then((res) => {
    //   console.log(res);
    //   this.setState({
    //     materials: [...res.data.RawMaterials],
    //   });
    //   // console.log("Product: ", this.state.products);
    // });

    axios.get("/products/products").then((res) => {
      this.setState({
        productlist: [...res.data.Products],
      });
      console.log("Product: ", this.state.productlist);
    });

    axios.get("/measuring-units/measuring-units").then((res) => {
      console.log(res);

      this.setState({
        measuring_units: [...res.data.MeasuringUnits],
      });
    });
  }
  render() {
    return (
      <Box style={styles.box}>
        <Box fontSize="30px" mb={3}>
          Add Wastage
        </Box>
        {/* {this.state.errors.length > 0 ? (
          this.state.errors.map((error, index) => {
            return (
              <Box style={styles.box_msg} bgcolor="#f73067" key={index}>
                {error}
              </Box>
            );
          })
        ) : this.state.success === true ? ( */}
        {/* <Box bgcolor="#3df45b" style={styles.box_msg}>
            Successful
          </Box> */}
        {/* ) : null} */}
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
                        Wastage Type
                      </InputLabel>
                      <Select
                        variant="outlined"
                        required
                        name="Wastage_Type"
                        value={this.state.Wastage_Type}
                        onChange={(event) => {
                          this.setState({
                            Wastage_Type: event.target.value,
                            disable: true,
                          });
                        }}
                      >
                        <MenuItem value="Wastage Type" disabled>
                          Wastage Type
                        </MenuItem>
                        <MenuItem value="Product">Product</MenuItem>
                        <MenuItem value="RawMaterial">RawMaterial</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="50%" style={style}>
                    {this.state.Wastage_Type === "Product" ? (
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
                          variant="outlined"
                          required
                          name="Product_Name"
                          value={this.state.Product_Name}
                          onChange={(event) => {
                            let prodCode;
                            let measuring;
                            let availablestock;

                            this.state.products.map((product) => {
                              if (product.Product_Name === event.target.value) {
                                prodCode = product.Product_ID;
                                measuring = product.Measuring_Unit;
                                availablestock = product.Quantity;

                                console.log("Procode: ", prodCode);
                              }
                              return null;
                            });
                            this.setState({
                              Product_Name: event.target.value,
                              Product_ID: prodCode,
                              Measuring_Unit: measuring,
                              Available_Stock: availablestock,
                              disable: true,
                            });
                          }}
                        >
                          {this.state.products.map((product, index) => {
                            return (
                              // <MenuItem
                              //   //selected
                              //   key={index}
                              //   value={product.Product_Name}
                              // >
                              //   {product.Product_Name}
                              // </MenuItem>
                              <MenuItem
                                key={index}
                                value={product.Product_Name}
                              >
                                {this.state.productlist.map((list, index) => {
                                  if (product.Product_Name === list._id) {
                                    return list.product_name;
                                  }
                                  return null;
                                })}
                              </MenuItem>
                            );
                          })}
                        </Select> */}
                        <Autocomplete
                          options={this.state.products}
                          autoHighlight={true}
                          value={this.state.ProductRecord}
                          getOptionLabel={(option) =>
                            this.getProductName(option.Product_Name)
                          }
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
                                Product_Name: value.Product_Name,
                                Product_ID: value.Product_ID,
                                Measuring_Unit: value.Measuring_Unit,
                                Available_Stock: value.Quantity,
                              });
                            }

                            console.log("Product:", value);
                          }}
                        />
                      </FormControl>
                    ) : (
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
                          variant="outlined"
                          required
                          name="Raw_Material_Id"
                          value={this.state.Raw_Material_Id}
                          onChange={(event) => {
                            let materialCode;
                            let Measuring;
                            let availablestock;

                            this.state.materials.map((material) => {
                              if (
                                material.Raw_Material_Id === event.target.value
                              ) {
                                materialCode = material.Raw_Material_Code;
                                Measuring = material.Measuring_Unit;
                                availablestock = material.Quantity;
                                console.log("code: ", materialCode);
                              }
                              return null;
                            });
                            this.setState({
                              Raw_Material_Id: event.target.value,
                              raw_material_code: materialCode,
                              Measuring_Unit: Measuring,
                              Available_Stock: availablestock,

                              disable: true,
                            });
                          }}
                        >
                          {this.state.materials.map((material1, index) => {
                            return (
                              <MenuItem
                                key={index}
                                value={material1.Raw_Material_Id}
                              >
                                {this.state.material.map((material, index) => {
                                  if (
                                    material1.Raw_Material_Id === material._id
                                  ) {
                                    return material.raw_material_name;
                                  }
                                  return null;
                                })}
                              </MenuItem>
                            );
                          })}
                        </Select> */}
                        <Autocomplete
                          options={this.state.materials}
                          autoHighlight={true}
                          value={this.state.materialRecord}
                          getOptionLabel={(option) =>
                            this.getMaterialName(option.Raw_Material_Id)
                          }
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
                              this.state.raw_material_code
                            );
                            if (value !== null) {
                              this.setState({
                                materialRecord: value,
                                Raw_Material_Id: value.Raw_Material_Id,
                                raw_material_code: value.Raw_Material_Code,
                                Measuring_Unit: value.Measuring_Unit,
                                Available_Stock: value.Quantity,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    )}
                  </Box>
                  <Box width="50%" style={style}>
                    <TextField
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
                          disable: true,
                        });
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
                          paddingRight: "2px",
                        }}
                      >
                        Id Type
                      </InputLabel>
                      <Select
                        variant="outlined"
                        required
                        name="Id_Type"
                        value={this.state.Id_Type}
                        onChange={(event) => {
                          this.setState({
                            Id_Type: event.target.value,
                            disable: true,
                          });
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
                          paddingRight: "2px",
                        }}
                      >
                        Measuring Unit
                      </InputLabel>
                      <Select
                        name="Measuring_Unit"
                        variant="outlined"
                        required
                        value={this.state.Measuring_Unit}
                        onChange={(event) => {
                          this.setState({
                            Measuring_Unit: event.target.value,
                            disable: true,
                          });
                          console.log(event.target.value);
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

                <Box style={styles.boxSize2} overflow={true}>
                  <Box
                    width="100%"
                    style={style}
                    flexDirection="row"
                    display="flex"
                    overflow="auto"
                    flexWrap="wrap"
                    maxHeight="100px"
                  >
                    {this.state.Id.map((poc, index) => {
                      return (
                        <Box display="flex" width="33.33%" pt={0.3}>
                          <TextField
                            size="small"
                            fullWidth
                            variant="outlined"
                            label="Id"
                            required
                            name="Id"
                            value={this.state.Id[index].id}
                            onChange={(event) => {
                              this.setState({
                                a_id: event.target.value,
                                disable: true,
                              });
                              console.log(event.target.value);
                              this.setState((prevState) => {
                                prevState.Id[index].id = prevState.a_id;

                                console.log("====", prevState.Id[index]);
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
                                this.setState((prevState) => {
                                  prevState.Id.push({
                                    id: "",
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
                                padding: "0px",

                                margin: "4px",
                              }}
                              onClick={() => {
                                this.setState({});
                                this.setState((prevState) => {
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
                      maxDate={new Date()}
                      id="4"
                      variant="outlined"
                      Name="Wastage Date"
                      value={this.state.Wastage_Date}
                      setDate={(date) => {
                        this.setState({
                          Wastage_Date: date,
                          disable: true,
                        });
                        console.log(date);
                      }}
                    />
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="100%" style={style}>
                    <TextField
                      multiline
                      rowsMax="3"
                      variant="outlined"
                      fullWidth
                      label="Reasons"
                      size="small"
                      value={this.state.Description}
                      onChange={(event) => {
                        this.setState({
                          Description: event.target.value,
                          disable: false,
                        });
                        console.log(event.target.value);
                      }}
                    ></TextField>
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="100%" display="flex" justifyContent="flex-end">
                    <TextField
                      size="small"
                      label="Available Stock"
                      disabled
                      defaultValue=" "
                      InputLabelProps={{
                        style: {
                          color: "black",
                          fontWeight: "bold",
                        },
                      }}
                      InputProps={{
                        style: {
                          fontWeight: "bold",
                        },
                      }}
                      value={this.state.Available_Stock}
                      onChange={(event) => {
                        this.setState({
                          Available_Stock: event.target.value,
                          disable: false,
                        });
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
          <Box marginLeft="10px">
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              fontSize="20px"
              onClick={() => {
                this.onAddHandler();
              }}
              // disabled={this.state.disable}
              disabled={this.state.subdisplay}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
}
