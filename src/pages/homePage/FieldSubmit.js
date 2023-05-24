import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import agent from "../../agent";
import { addField } from "../../reducers/user";
import FormHelperText from "@mui/material/FormHelperText";

function FieldSubmit({ setFieldSelect, selectedPoints, setSelectedPoints }) {
  const [error, setError] = useState({});
  const [date, setDate] = useState(new Date());
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    const fieldData = {
      field_name: e.target.fieldName.value,
      field_address: e.target.fieldAddress.value,
      field_coordinates: {
        coordinates: [...selectedPoints, selectedPoints[0]],
      },
      field_crop: e.target.fieldCrop.value,
      bud_break: `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" : ""}${
        date.getMonth() + 1
      }-${date.getDate() + 1 < 10 ? "0" : ""}${date.getDate()}`,
      user: user.user.id,
    };

    agent.Field.add(fieldData)
      .then((res) => {
        setFieldSelect(false);
        setSelectedPoints([]);
        dispatch(addField(res.data));
      })
      .catch((err) => {
        console.error(err);
        setError(err.response.data);
      });
  };

  return (
    <div className="overlay overlay--popup">
      <div className="popup-form">
        <h1 className="popup-form__header">Confirm Field</h1>
        <form className="popup-form__form" onSubmit={submitHandler}>
          <FormHelperText error={error.error ? true : false} variant="filled">
            {error.error ? error.error.message : null}
          </FormHelperText>
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="Field Name"
            name="fieldName"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="Field Address"
            name="fieldAddress"
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="Field Crop"
            name="fieldCrop"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Bud Break"
              value={date}
              onChange={(newDate) => {
                setDate(newDate);
              }}
              minDate={new Date()}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  error={error.bud_break ? true : false}
                  helperText={error.bud_break}
                />
              )}
            />
          </LocalizationProvider>
          <div className="popup-form__buttons">
            <Button
              variant="outlined"
              type="button"
              onClick={() => {
                setFieldSelect("selecting");
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FieldSubmit;
