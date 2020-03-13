import React from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import MomentUtils from "@date-io/moment";

export const Datepick = props => {
  // const [state, setState] = React.useState({});
  const handleDateChange = date => {
    props.setDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDatePicker
        disabled={props.disabled}
        size="small"
        id={`date-picker-dialog${props.id}`}
        label={props.Name}
        minDate={props.minDate}
        maxDate={props.maxDate}
        format="DD/MM/YYYY"
        onChange={handleDateChange}
        value={props.value}
        KeyboardButtonProps={{
          "aria-label": "change date"
        }}
        fullWidth
        inputVariant="outlined"
        style={{
          marginRight: props.marginRight,
          marginTop: "0px",
          marginBottom: props.marginBottom
        }}
        required={props.Req}
      />
    </MuiPickersUtilsProvider>
  );
};
