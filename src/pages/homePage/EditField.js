import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import agent from "../../agent";
import { editField as editFieldAction } from "../../reducers/user";

function FieldSubmit({ editField, setEditField }) {
  const [error, setError] = useState({});
  const [date, setDate] = useState(editField.bud_break);
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    const fieldData = {
      field_name: e.target.fieldName.value,
      field_address: e.target.fieldAddress.value,
      field_crop: e.target.fieldCrop.value,
      bud_break: `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" : ""}${
        date.getMonth() + 1
      }-${date.getDate() + 1 < 10 ? "0" : ""}${date.getDate()}`,
    };

    agent.Field.update(editField.id, fieldData, localStorage.getItem("access"))
      .then(() => {
        agent.Field.retrieve(editField.id, localStorage.getItem("access"))
          .then((res) => {
            dispatch(editFieldAction(res.data));
            setEditField();
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        setError(err.response.data);
        console.error(err.response.data);
      });
  };

  return (
    <div className="overlay overlay--popup">
      <div className="popup-form">
        <h1 className="popup-form__header">Edit Field</h1>
        <form className="popup-form__form" onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="Field Name"
            name="fieldName"
            defaultValue={editField.field_name}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="Field Address"
            name="fieldAddress"
            defaultValue={editField.field_address}
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="Field Crop"
            name="fieldCrop"
            defaultValue={editField.field_crop}
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
                setEditField();
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
