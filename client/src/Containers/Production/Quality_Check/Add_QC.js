import React, { Component } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  FormControlLabel,
  LinearProgress,
} from "@material-ui/core";
// import PaperBoard from "../../Common_Files/PaperBoard/PaperBoard";
import axios from "axios";
import Styles from "../styles/FormStyles";
import { Datepick } from "../../../Components/Date/Datepick";
import { Link, Redirect, history } from "react-router-dom";

const styles = Styles;
const style = {
  marginRight: "6px",
  marginLeft: "6px",
};
export default class Qualitycheck extends Component {
  constructor(props) {
    super();
    this.state = {
      mvalue: 0,
      _id: "",
      QC_Type: "",
      Product_Name: "",
      Product_ID: "",
      Batch_Id: "",
      Measuring_Unit: "",
      Quantity: "",
      Id_Type: "",
      Id: "",
      QC_Id: "",
      Box_Id: "",
      I_Capacity: 0,
      B_Capacity: 0,
      Method: [],
      QC_Date: null,
      Result: "",
      Comments: "",
      Status: "Ready to QC",
      products: [],
      errors: [],
      measuring_units: [],
      methods: [],
      productcodes: [],
      lastid: 0,
      lastvalue: "",
      boxlastid: 0,
      prefixcode: "",
      boxprefixcode: "",
      boxcodes: [],
      dates: [],
      display: "none",
      disable: true,
      subdisplay: false,
      progress: false,
      Redirect: false,
      // ds: "06-03-2020"
    };
    this.onEditHandler = () => {
      if (
        ((this.state.I_Capacity !== 0 || this.state.B_Capacity !== 0) &&
          this.state.Box_Id !== "" &&
          this.state.Id !== "" &&
          this.state.Id_Type !== "" &&
          this.state.QC_Date !== null &&
          this.state.mvalue > 0 &&
          this.state.Result !== undefined) ||
        (this.state.QC_Id !== "" &&
          this.state.mvalue > 0 &&
          this.state.Result !== undefined &&
          this.state.QC_Date !== null)
      ) {
        this.setState({
          subdisplay: true,
          progress: true,
        });
        axios
          .post("/quality-check/add", {
            _id: this.state._id,
            QC_Type: this.state.QC_Type,
            Product_Name: this.state.Product_Name,
            Product_ID: this.state.Product_ID,
            Batch_Id: this.state.Batch_Id,
            Measuring_Unit: this.state.Measuring_Unit,
            Quantity: this.state.Quantity,
            Method: this.state.methods,
            Id_Type: this.state.Id_Type,
            Id: this.state.Id,
            QC_Id: this.state.QC_Id,
            Box_Id: this.state.Box_Id,
            I_Capacity: this.state.I_Capacity,
            B_Capacity: this.state.B_Capacity,
            QC_Date: this.state.QC_Date,
            Result: this.state.Result,
            Comments: this.state.Comments,
            Status: this.state.Status,
          })
          .then((res) => {
            console.log(res);
            this.setState({
              progress: false,
            });
            this.setState({
              Redirect: true,
            });
            this.props.cancel();

            // Redirect("/home/production/manage-qc");
            // this.history.pushState("/home/production/manage-qc");
            // return <Redirect to="/home/production/manage-qc" />;
          })
          .catch((err) => console.log(err));
      } else {
        alert("Please check all the fields are entered properly");
      }
    };
  }
  componentDidMount() {
    axios.get("/measuring-units/measuring-units").then((res) => {
      console.log(res);
      this.setState({
        measuring_units: [...res.data.MeasuringUnits],
      });
      axios.get("/products/products").then((res) => {
        console.log(res);
        this.setState({
          products: [...res.data.Products],
        });
      });
      axios.get("/qc-method").then((res) => {
        console.log("qc----", res);
        this.setState({
          methods: [...res.data],
        });
      });
      axios.get("/product-code").then((res) => {
        console.log("productcodes", res.data.ProductCode);
        this.setState({
          productcodes: [...res.data.ProductCode],
          prefixcode:
            res.data.ProductCode[0].code_prefix +
            res.data.ProductCode[0].code_separator,
        });
      });
      axios.get("/box-code").then((res) => {
        console.log("boxcodes", res.data.BoxCode);
        this.setState({
          boxcodes: [...res.data.BoxCode],
          boxprefixcode:
            res.data.BoxCode[0].code_prefix +
            res.data.BoxCode[0].code_separator,
        });
        console.log(
          "concode:",
          res.data.BoxCode[0].code_prefix + res.data.BoxCode[0].code_separator
        );
      });
      axios.get("/quality-check/lastcode").then((res) => {
        console.log("Lastcodes", res);
        console.log("data1", res.data.length);

        if (res.data.length !== 0) {
          console.log("data", res.data.length);
          this.setState({
            lastid: res.data.Id[res.data.Id.length - 1].split("-")[1],
          });
        } else {
          this.setState({
            lastid: 0,
          });
        }
        console.log("Lastid", this.state.lastid);
      });
      axios.get("/quality-check/blcode").then((res) => {
        console.log("BoxLastcodes", res);
        console.log("boxid", res.data.Box_Id);
        if (res.data.length !== 0) {
          this.setState({
            boxlastid: res.data.Box_Id[res.data.Box_Id.length - 1].split(
              "-"
            )[1],
          });
        } else {
          this.setState({
            boxlastid: 0,
          });
        }
        console.log("boxLastid", this.state.boxlastid);
      });
      // axios.get("/production").then(date => {
      //   this.setState({
      //     dates: [...date.data]
      //   });
      // });
      if (
        this.state.Status === "Ready for QC" ||
        this.state.Status === "Ready to Product QC"
      ) {
        this.setState({
          QC_Type: "Product",
        });
      } else {
        this.setState({
          QC_Type: "Packing",
        });
      }
    });
    this.setState({
      QC_Type: this.props.qualitycheck.QC_Type,
      Product_Name: this.props.qualitycheck.Product_Name,
      Product_ID: this.props.qualitycheck.Product_ID,
      Batch_Id: this.props.qualitycheck.Batch_Id,
      Quantity: this.props.qualitycheck.Quantity,
      Id_Type: this.props.qualitycheck.Id_Type,
      Id: this.props.qualitycheck.Id,
      Box_Id: this.props.qualitycheck.Box_Id,
      I_Capacity: this.props.qualitycheck.I_Capacity,
      B_Capacity: this.props.qualitycheck.B_Capacity,
      Measuring_Unit: this.props.qualitycheck.Measuring_Unit,
      Method: this.props.qualitycheck.Method,
      QC_Date: this.state.QC_Date,
      Result: this.props.qualitycheck.Result,
      Comments: this.props.qualitycheck.Comments,
      Status: this.props.qualitycheck.Status,
    });
  }
  render() {
    return (
      <Box style={styles.box}>
        {this.state.Redirect === true ? (
          <Redirect to="/home/production/manage-qc" />
        ) : (
          <Box></Box>
        )}
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
                    {/* <FormControl
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
                        Qualitycheck Type
                      </InputLabel>
                      <Select
                        variant="outlined"
                        required
                        name="QC_Type"
                        value={this.state.QC_Type}
                        onChange={(event) => {
                          this.setState({
                            QC_Type: event.target.value,
                            disable: true,
                          });
                        }}
                      >
                        <MenuItem value="Qualitycheck Type" disabled>
                          Qualitycheck Type
                        </MenuItem>
                        <MenuItem value="Product">Product</MenuItem>
                        <MenuItem value="Packing">Packing</MenuItem>
                      </Select>
                    </FormControl> */}

                    <TextField
                      size="small"
                      fullWidth
                      disabled
                      variant="outlined"
                      label="Quality Check Type"
                      required
                      name="QC_Type"
                      value={this.state.QC_Type}
                      onChange={(event) => {
                        this.setState({
                          QC_Type: event.target.value,
                          disable: true,
                        });
                      }}
                    ></TextField>
                  </Box>
                </Box>
                <Box style={styles.boxSize2}>
                  <Box width="100%" style={style}>
                    <TextField
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Batch_Id"
                      required
                      disabled
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
                        Product Name
                      </InputLabel>
                      <Select
                        variant="outlined"
                        required
                        disabled
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
                            Id: prodCode,
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
                      size="small"
                      fullWidth
                      disabled
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
                  <Box width="50%" style={style}>
                    <TextField
                      size="small"
                      fullWidth
                      variant="outlined"
                      label="Quantity"
                      required
                      disabled
                      name="Quantity"
                      value={this.state.Quantity}
                      onChange={(event) => {
                        this.setState({
                          Quantity: event.target.value,
                        });

                        // let temp = [];
                        // let calc;
                        // for (let i = 1; i <= this.state.Quantity; i++) {
                        //   calc =
                        //     this.state.prefixcode +
                        //     (parseInt(this.state.lastid) + i);
                        //   temp.push(calc);
                        // }
                        // this.setState({ Id: temp });
                        // console.log("ids", temp);
                      }}
                    ></TextField>
                    {/* */}
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
                        disabled
                        value={this.state.Measuring_Unit}
                        onChange={(event) => {
                          this.setState({
                            Measuring_Unit: event.target.value,
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
                {this.state.QC_Type === "Packing" ? (
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
                      <TextField
                        size="small"
                        fullWidth
                        variant="outlined"
                        label="Box Capacity"
                        required
                        name="B_Capacity"
                        value={this.state.B_Capacity}
                        onChange={(event) => {
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
                          console.log("ids+", cal);
                        }}
                      ></TextField>
                    </Box>
                    {/* {this.state.QC_Type === "Packing" ? ( */}
                    <Box width="50%" style={style}>
                      <TextField
                        size="small"
                        fullWidth
                        variant="outlined"
                        label="Individual Capacity"
                        required
                        name="I_Capacity"
                        value={this.state.I_Capacity}
                        onChange={(event) => {
                          this.setState({ I_Capacity: event.target.value });

                          let temp = [];
                          let calc;
                          for (let i = 1; i <= event.target.value; i++) {
                            calc =
                              this.state.prefixcode +
                              (parseInt(this.state.lastid) + i);
                            temp.push(calc);
                          }
                          this.setState({ Id: temp });
                          console.log("ids", temp);
                          console.log("ids+", calc);
                        }}
                      ></TextField>
                    </Box>
                  </Box>
                ) : null}
                {this.state.QC_Type === "Packing" ? (
                  <Box style={styles.boxSize2}>
                    <Box width="100%" style={style}>
                      <TextField
                        size="small"
                        fullWidth
                        variant="outlined"
                        label="Box Id"
                        required
                        name="Box_Id"
                        value={this.state.Box_Id}
                        onChange={(event) => {
                          this.setState({
                            Box_Id: event.target.value,
                          });
                        }}
                      ></TextField>
                    </Box>
                  </Box>
                ) : null}
                {this.state.QC_Type === "Packing" ? (
                  <Box style={styles.boxSize2}>
                    <Box width="100%" style={style}>
                      <TextField
                        size="small"
                        fullWidth
                        variant="outlined"
                        label="Individual Id"
                        required
                        name="Id"
                        value={this.state.Id}
                        onChange={(event) => {
                          this.setState({
                            Id: event.target.value,
                          });
                        }}
                      ></TextField>
                    </Box>
                  </Box>
                ) : (
                  <Box style={styles.boxSize2}>
                    <Box width="100%" style={style}>
                      <TextField
                        size="small"
                        fullWidth
                        variant="outlined"
                        label="QC Id"
                        required
                        name="QC_Id"
                        value={this.state.QC_Id}
                        onChange={(event) => {
                          this.setState({ QC_Id: event.target.value });
                        }}
                      ></TextField>
                    </Box>
                  </Box>
                )}
                <Box style={styles.boxSize2}>
                  <Box width="100%" style={style}>
                    <Datepick
                      id="4"
                      variant="outlined"
                      Name="QC_Date"
                      label="QC_Date"
                      // minDate={
                      //   new Date(
                      //     this.state.dates.map(Dates => {
                      //       if (Dates.Batch_Id === this.state.Batch_Id) {
                      //         let ds = Dates.Manufacture_Date;
                      //       }
                      //     })
                      //   )
                      // }
                      value={this.state.QC_Date}
                      setDate={(date) => {
                        this.setState({
                          QC_Date: date,
                          disable: true,
                        });
                        // this.state.dates.map(Dates => {
                        //   if (Dates.Batch_Id === this.state.Batch_Id) {
                        //     ds = Dates.Manufacture_Date;
                        //   }
                        // });
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
                                key={index}
                                checked={method.Value}
                                name="Method"
                                value={this.state.Method}
                                onClick={(event) => {
                                  method.Value = !method.Value;
                                  console.log(method.Value);
                                  if (method.Value === true) {
                                    this.setState({
                                      mvalue: this.state.mvalue + 1,
                                    });
                                  }
                                  if (method.Value === false) {
                                    this.setState({
                                      mvalue: this.state.mvalue - 1,
                                    });
                                  }

                                  this.setState({
                                    methods: [...this.state.methods],
                                    Method: event.target.value,
                                  });

                                  console.log("methods", this.state.methods);
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
                          paddingRight: "2px",
                        }}
                      >
                        Result Status
                      </InputLabel>
                      <Select
                        variant="outlined"
                        required
                        name="Result"
                        value={this.state.Result}
                        onChange={(event) => {
                          if (this.state.mvalue > 0) {
                            console.log(this.state.mvalue);
                            console.log("result", this.state.Result);
                            this.setState({
                              Result: event.target.value,
                              disable: false,
                            });
                          } else {
                            alert("Please Check The Method");
                          }
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
                    display="flex"
                    alignItems="center"
                    width="100%"
                  >
                    <TextField
                      size="small"
                      multiline
                      variant="outlined"
                      fullWidth
                      // placeholder="comments"
                      label="Comments"
                      rowsMax="3"
                      name="Comments"
                      value={this.state.Comments}
                      onChange={(event) => {
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
          <Box marginLeft="10px">
            {/* <Link
            to="/home/production/manage-qc"
             
            > */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              fontWeight="bold"
              onClick={this.onEditHandler}
              // disabled={this.state.disable}
              disabled={this.state.subdisplay}
            >
              {/* this.onEditHandler,this.manage */}
              submit
            </Button>
            {/* </Link> */}
          </Box>
        </Box>
      </Box>
    );
  }
}
