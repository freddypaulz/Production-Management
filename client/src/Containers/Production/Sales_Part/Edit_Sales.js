import React, { Component } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogContent,
  LinearProgress,
} from "@material-ui/core";
import axios from "axios";
import Styles from "../styles/FormStyles";
import { Datepick } from "../../../Components/Date/Datepick";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Autocomplete from "@material-ui/lab/Autocomplete";

const styles = Styles;
const style = {
  marginRight: "6px",
  marginLeft: "6px",
};
export default class EditSales extends Component {
  constructor(props) {
    super();
    this.state = {
      _id: "",
      Product_Name: "Product_Name",
      Product_ID: "Product_ID",
      Quantity: " Quantity",
      Measuring_Unit: "Measuring_Unit",
      Box_Id: [{ id: "" }],
      Selling_Date: null,
      Distributor: "",
      Payment_Type: "",
      Price: "",
      Final_Price: "",
      Discount: "",
      Advance: "",
      Balance: "",
      errors: [],
      success: false,
      measuring_units: [],
      products: [],
      product: [],
      productlist: [],
      code: "",
      b_id: "",
      distributors: [],
      DiscountValue: null,
      distributorlist: [],
      distributorInfo: false,
      openDialog: false,
      subdisplay: false,
      progress: true,
      ProductRecord: [],
      currency: [],
    };
    this.onEditHandler = () => {
      if (
        this.state.Product_Name !== "" &&
        this.state.Quantity !== "" &&
        this.state.Box_Id[0].id !== "" &&
        this.state.Selling_Date !== null &&
        this.state.Distributor !== "" &&
        this.state.Payment_Type !== "" &&
        this.state.Balance >= 0
      ) {
        this.setState({
          subdisplay: true,
          progress: true,
        });
        axios
          .post("/sales/edit", {
            _id: this.state._id,
            Product_ID: this.state.Product_ID,
            Product_Name: this.state.Product_Name,
            Box_Id: this.state.Box_Id,
            Quantity: this.state.Quantity,
            Measuring_Unit: this.state.Measuring_Unit,
            Selling_Date: this.state.Selling_Date,
            Distributor: this.state.Distributor,
            Payment_Type: this.state.Payment_Type,
            Price: this.state.Price,
            Final_Price: this.state.Final_Price,
            Discount: this.state.Discount,
            Advance: this.state.Advance,
            Balance: this.state.Balance,
          })
          .then((res) => {
            console.log(res.data);
            this.setState({
              progress: true,
            });
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
          .catch((err) => console.log(err));
      } else {
        alert("Please check all the fields are entered properly");
      }
    };
    this.distributorInfo = () => {
      let temp = [];
      console.log("Distributor Details");
      this.state.distributorlist.map((distributor, index) => {
        if (distributor._id === this.state.Distributor) {
          console.log("matched");
          temp.push(
            <Box key={index}>
              <h4 style={{ padding: "0px", margin: "0px" }}>Distributor:</h4>
              {`${distributor.distributor_name} - ${distributor.distributor_mobile_no} - ${distributor.distributor_email}`}{" "}
              <br />
              <h4 style={{ padding: "0px", margin: "0px" }}>
                Point of contacts:
              </h4>
              {distributor.distributor_point_of_contact.map((poc, key) => (
                <Box key={key}>
                  {poc.name + " ( " + poc.designation + " ) - " + poc.mobile_no}
                </Box>
              ))}
            </Box>
          );
        } else {
          console.log("not match");
        }
        return null;
      });
      return temp;
    };
    this.openDialog = () => {
      this.setState({ openDialog: true });
    };
    // this.closeDialog = () => {
    //   this.setState({ openDialog: false });
    // };
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
    axios.get("/currency").then((res) => {
      this.setState({
        currency: res.data.Currency[0].currency_type,
      });
      console.log("currency:", this.state.currency);
    });
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
        product: [...res.data.Products],
      });

      // console.log("Product: ", this.state.products);
    });
    axios.get("/products/products").then((res) => {
      console.log(res);
      this.setState({
        productlist: [...res.data.Products],
      });

      // console.log("Product: ", this.state.products);
    });
    axios.get("/production-stock/stock").then((res) => {
      console.log("products", res.data);
      this.setState({ products: [...res.data] });
    });
    axios.get("/distributors/distributors").then((res) => {
      console.log(res);
      this.setState({
        distributors: [...res.data.Distributors],
        distributorlist: [...res.data.Distributors],
        progress: false,
      });
      console.log("distributors : ", res.data.Distributors);
    });
    console.log("productrecord", this.props.ProductRecord());

    this.setState({
      ProductRecord: this.props.ProductRecord(),
      _id: this.props.sales._id,
      Product_Name: this.props.sales.Product_Name,
      Quantity: this.props.sales.Quantity,
      Product_ID: this.props.sales.Product_ID,
      Measuring_Unit: this.props.sales.Measuring_Unit,
      Box_Id: this.props.sales.Box_Id,
      Selling_Date: this.props.sales.Selling_Date,
      Distributor: this.props.sales.Distributor,
      Payment_Type: this.props.sales.Payment_Type,
      Price: this.props.sales.Price,
      Final_Price: this.props.sales.Final_Price,
      Discount: this.props.sales.Discount,
      Advance: this.props.sales.Advance,
      Balance: this.props.sales.Balance,
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
          Edit Sales
        </Box>
        {/* {this.state.errors.length > 0 ? (
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
        ) : null} */}
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
                    <FormControl variant="outlined" fullWidth size="small">
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
                        disabled={this.props.disabled.Product_Name}
                        value={this.state.Product_Name}
                        onChange={(event) => {
                          let prodCode;
                          let prodMeasur;
                          this.state.products.map((product) => {
                            if (product._id === event.target.value) {
                              prodCode = product.product_code;
                              prodMeasur = product.product_measuring_unit;
                              console.log("Procode: ", prodCode);
                            }
                            return null;
                          });
                          this.setState({
                            Product_Name: event.target.value,
                            Product_ID: prodCode,
                            Measuring_Unit: prodMeasur,
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
                            
                      </Select> */}
                      <Autocomplete
                        options={this.state.products}
                        autoHighlight={true}
                        value={this.state.ProductRecord}
                        getOptionLabel={(option) =>
                          this.getProductName(option.product_name)
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
                  </Box>
                  <Box width="50%" style={style}>
                    <TextField
                      disabled
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
                    <FormControl variant="outlined" fullWidth size="small">
                      <InputLabel
                        style={{
                          backgroundColor: "white",
                          paddingLeft: "2px",
                          paddingRight: "2px",
                        }}
                      >
                        Distributor
                      </InputLabel>
                      <Select
                        variant="outlined"
                        required
                        name="Distributor"
                        disabled={this.props.disabled.Distributor}
                        value={this.state.Distributor}
                        onChange={(event) => {
                          this.setState({
                            Distributor: event.target.value,
                          });
                        }}
                      >
                        {this.state.distributors.map((distributor, index) => {
                          return (
                            <MenuItem
                              selected
                              key={index}
                              value={distributor._id}
                            >
                              {distributor.distributor_name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="50%" style={style}>
                    <TextField
                      disabled={true}
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Quantity"
                      required
                      name="Quantity"
                      value={this.state.Quantity}
                      onChange={(event) => {
                        let prodprice = 1;

                        this.state.products.map((product) => {
                          console.log("Pro: ", this.state.Product_Name);
                          if (product._id === this.state.Product_Name) {
                            prodprice = parseInt(product.product_price);
                            console.log("Procode123: ", product.product_price);
                          }
                          return null;
                        });
                        this.setState({
                          Quantity: event.target.value,
                          Price: event.target.value * prodprice,
                          // DiscountValue:
                          //   this.state.Price * (this.state.Discount / 100),
                          // Final_Price:
                          //   this.state.Price - this.state.DiscountValue,
                          // Balance: this.state.Final_Price - this.state.Advance
                        });
                      }}
                    ></TextField>
                  </Box>
                  <Box width="50%" style={style}>
                    <FormControl variant="outlined" fullWidth size="small">
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
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Box style={styles.boxSize2} display="flex" flexDirection="row">
                  <Box
                    width="100%"
                    style={style}
                    // style={styles.box_field}
                    //padding="10px"
                    //border="1px solid #3f51b5"
                    //marginBottom="10px"
                    flexDirection="row"
                    display="flex"
                  >
                    {this.state.Box_Id.map((id, index) => {
                      return (
                        <Box display="flex">
                          <TextField
                            size="small"
                            fullWidth
                            variant="outlined"
                            label="Box_Id"
                            required
                            name="Box_Id"
                            disabled={this.props.disabled.Box_Id}
                            value={this.state.Box_Id[index].id}
                            onChange={(event) => {
                              this.setState({
                                b_id: event.target.value,
                              });
                              console.log(event.target.value);
                              this.setState((prevState) => {
                                prevState.Box_Id[index].id = prevState.b_id;

                                // console.log( prevState.Box_Id[index]);
                              });
                            }}
                          ></TextField>

                          {this.state.Box_Id.length === index + 1 ? (
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
                                  prevState.Box_Id.push({
                                    id: "",
                                  });
                                  console.log(prevState.Box_Id);
                                });
                              }}
                            />
                          ) : (
                            <DeleteOutlineIcon
                              color="secondary"
                              style={{
                                fontSize: "30px",
                                margin: "4px",
                                padding: "0px",
                              }}
                              onClick={() => {
                                this.setState({});
                                this.setState((prevState) => {
                                  prevState.Box_Id.splice(index, 1);
                                  console.log(prevState.Box_Id);
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
                      id="4"
                      variant="outlined"
                      Name="Selling_Date"
                      disabled={this.props.disabled.Selling_Date}
                      value={this.state.Selling_Date}
                      setDate={(date) => {
                        this.setState({
                          Selling_Date: date,
                        });
                        console.log(date);
                      }}
                    />
                  </Box>
                </Box>

                <Box style={styles.boxSize2}>
                  <Box width="50%" style={style}>
                    <TextField
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Discount"
                      required
                      name="Discount"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      disabled={this.props.disabled.Discount}
                      value={this.state.Discount}
                      onChange={(event) => {
                        event.persist();
                        this.setState({
                          Discount: event.target.value,
                        });

                        this.setState((prev) => {
                          prev.DiscountValue =
                            prev.Price * (event.target.value / 100);
                          prev.Final_Price = prev.Price - prev.DiscountValue;
                          prev.Balance = prev.Final_Price - prev.Advance;
                        });

                        console.log("discount", this.state.DiscountValue);
                        console.log("price", this.state.Price);
                      }}
                    ></TextField>
                  </Box>
                  <Box width="50%" style={style}>
                    <TextField
                      disabled={true}
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Total Price"
                      required
                      name="Price"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            {this.state.currency}
                          </InputAdornment>
                        ),
                      }}
                      value={this.state.Price}
                      // onChange={event => {
                      //   this.setState({
                      //     Price: event.target.value
                      //   });
                      //   //console.log(event.target.value);
                      // }}
                    ></TextField>
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="50%" style={style}>
                    <FormControl variant="outlined" fullWidth size="small">
                      <InputLabel
                        style={{
                          backgroundColor: "white",
                          paddingLeft: "2px",
                          paddingRight: "2px",
                        }}
                      >
                        Payment Type
                      </InputLabel>
                      <Select
                        variant="outlined"
                        required
                        name="Payment_Type"
                        disabled={this.props.disabled.Payment_Type}
                        value={this.state.Payment_Type}
                        onChange={(event) => {
                          this.setState({
                            Payment_Type: event.target.value,
                          });
                        }}
                      >
                        <MenuItem value="Payment Type" disabled>
                          Payment Type
                        </MenuItem>
                        <MenuItem value="By Cash">By Cash</MenuItem>
                        <MenuItem value="By Cheque">By Cheque</MenuItem>
                        <MenuItem value="Debit">Debit</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box width="50%" style={style}>
                    <TextField
                      disabled
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Final_Price"
                      required
                      name="Final_Price"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            {this.state.currency}
                          </InputAdornment>
                        ),
                      }}
                      value={this.state.Final_Price}
                      // onChange={event => {
                      //   this.setState({
                      //     Final_Price: event.target.value
                      //   });
                      //   console.log(event.target.value);
                      // }}
                    ></TextField>
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="50%" style={style}>
                    <TextField
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Advance Amount"
                      required
                      name="Advance"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            {this.state.currency}
                          </InputAdornment>
                        ),
                      }}
                      disabled={this.props.disabled.Advance}
                      value={this.state.Advance}
                      onChange={(event) => {
                        this.setState({
                          Advance: event.target.value,
                          Balance: this.state.Final_Price - event.target.value,
                        });
                        console.log(event.target.value);
                      }}
                    ></TextField>
                  </Box>

                  <Box width="50%" style={style}>
                    <TextField
                      disabled
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Balance Amount"
                      required
                      name="Balance"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            {this.state.currency}
                          </InputAdornment>
                        ),
                      }}
                      value={this.state.Balance}
                      // onChange={event => {
                      //   this.setState({
                      //     Balance: event.target.value
                      //   });
                      //   console.log(event.target.value);
                      // }}
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
          <Box
            marginRight="10px"
            display={this.state.Distributor !== "" ? "flex" : "none"}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                this.setState({
                  distributorInfo: true,
                });
                this.openDialog();
                // this.state.openDialog = true;
              }}
              // style={{ fontWeight: "bold" }}
            >
              Distributor Info
            </Button>
          </Box>
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
        {/* <Dialog
          open={this.state.openDialog}
          onBackdropClick={(this.state.openDialog = false)}
          maxWidth="sm"
          fullWidth
        > */}
        <Dialog
          open={this.state.openDialog}
          // onBackdropClick={() => {
          //   return this.state.distributorInfo === true ? (
          //     this.closeDialog()
          //   ) : (
          //     //(this.state.openDialog = false)
          //     <Box></Box>
          //   );
          // }}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent>
            {/* {this.state.distributorInfo === true ? ( */}
            <Box display="flex" flexDirection="column">
              <Box fontSize="25px" mb={3} textAlign="center" fontWeight="bold">
                Distributor Information
              </Box>
              <Box>{this.distributorInfo()}</Box>
              <Box display=" flex" alignContent="end" pt={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    this.props.cancel();
                  }}
                >
                  Back
                </Button>
              </Box>
            </Box>
            {/* ) : (
              // (this.state.openDialog = false)

              this.closeDialog()
            )} */}
          </DialogContent>
          {/* </Dialog> */}
        </Dialog>
      </Box>
    );
  }
}
