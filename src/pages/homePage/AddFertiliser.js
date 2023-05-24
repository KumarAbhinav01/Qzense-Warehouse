import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import agent from "../../agent";
import { useDispatch } from "react-redux";
import { addFertilizer } from "../../reducers/user";

function AddFertiliser({ activeField, setAdd }) {
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState({});
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = {
      date: `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" : ""}${
        date.getMonth() + 1
      }-${date.getDate() + 1 < 10 ? "0" : ""}${date.getDate()}`,
      fertilizer_type: e.target.fertilizerType.value,
      fertilizer_quantity: e.target.fertilizerQuantity.value,
      farmland: activeField.id,
    };

    agent.Fertilizer.add(formData)
      .then((res) => {
        console.log(res.data);
        dispatch(addFertilizer(res.data));
        setAdd(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="overlay overlay--popup">
      <div className="popup-form">
        <h1 className="popup-form__header">Add Fertiliser Info</h1>
        <form className="popup-form__form" onSubmit={submitHandler}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Fertilizer Date"
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
            label="Fertilizer Type"
            name="fertilizerType"
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            type="number"
            label="Fertilizer Quantity"
            name="fertilizerQuantity"
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

export default AddFertiliser;
