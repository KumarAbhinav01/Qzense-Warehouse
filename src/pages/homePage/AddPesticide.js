import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import agent from "../../agent";
import { useDispatch } from "react-redux";
import { addPesticide } from "../../reducers/user";

function AddPesticide({ activeField, setAdd }) {
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState({});
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = {
      spray_date: `${date.getFullYear()}-${
        date.getMonth() + 1 < 10 ? "0" : ""
      }${date.getMonth() + 1}-${
        date.getDate() + 1 < 10 ? "0" : ""
      }${date.getDate()}`,
      spray_type: e.target.pesticideType.value,
      spray_quantity: e.target.pesticideQuantity.value,
      farmland: activeField.id,
    };

    agent.Pesticide.add(formData)
      .then((res) => {
        console.log(res.data);
        dispatch(addPesticide(res.data));
        setAdd(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="overlay overlay--popup">
      <div className="popup-form">
        <h1 className="popup-form__header">Add Pesticide Info</h1>
        <form className="popup-form__form" onSubmit={submitHandler}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Pesticide Date"
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
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="Pesticide Type"
            name="pesticideType"
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            type="number"
            label="Pesticide Quantity"
            name="pesticideQuantity"
          />
          <div className="popup-form__buttons">
            <Button
              variant="outlined"
              type="button"
              onClick={() => {
                setAdd(false);
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

export default AddPesticide;
