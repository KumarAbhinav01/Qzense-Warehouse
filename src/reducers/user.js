import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    field: [],
    isAuthenticated: false,
    user: null,
    access: localStorage.getItem("access"),
    refresh: localStorage.getItem("refresh"),
  },
  reducers: {
    login: (state, action) => {
      const token = action.payload;
      localStorage.setItem("access", token.access);
      localStorage.setItem("refresh", token.refresh);

      state.isAuthenticated = true;
      state.access = token.access || state.access;
      state.refresh = token.refresh || state.refresh;
      state.user = token.email
        ? {
            email: token.email,
            firstName: token.first_name,
            lastName: token.last_name,
            id: token.id,
          }
        : state.user;
      state.field = token.user || [];
    },
    logout: (state) => {
      localStorage.clear();
      state.isAuthenticated = false;
      state.user = null;
      state.field = [];
      state.access = "";
      state.refresh = "";
    },
    setField: (state, action) => {
      state.field = action.payload;
    },
    addField: (state, action) => {
      state.field = [...state.field, action.payload];
    },
    deleteField: (state, action) => {
      state.field = state.field.filter(
        (field) => field.id !== action.payload.id
      );
    },
    editField: (state, action) => {
      state.field = state.field.map((field) => {
        if (field.id === action.payload.id) {
          return action.payload;
        } else return field;
      });
    },
    addFertilizer: (state, action) => {
      state.field = state.field.map((field) => {
        if (field.id === action.payload.farmland) {
          let temp = field;
          temp.fertiliser.push(action.payload);
          return temp;
        } else return field;
      });
    },
    deleteFertilizer: (state, action) => {
      state.field = state.field.reduce((result, current) => {
        if (current.id === action.payload.farmland) {
          let temp = current;
          temp.fertiliser = temp.fertiliser.filter(
            (fertiliser) => fertiliser.id !== action.payload.id
          );
          result.push(temp);
        } else {
          result.push(current);
        }
        return result;
      }, []);
    },
    addPesticide: (state, action) => {
      state.field = state.field.map((field) => {
        if (field.id === action.payload.farmland) {
          let temp = field;
          temp.pesticide.push(action.payload);
          return temp;
        } else return field;
      });
    },
    deletePesticide: (state, action) => {
      state.field = state.field.reduce((result, current) => {
        if (current.id === action.payload.farmland) {
          let temp = current;
          temp.pesticide = temp.pesticide.filter(
            (pesticide) => pesticide.id !== action.payload.id
          );
          result.push(temp);
        } else {
          result.push(current);
        }
        return result;
      }, []);
    },
    addHarvest: (state, action) => {
      state.field = state.field.map((field) => {
        if (field.id === action.payload.farmland) {
          let temp = field;
          temp.harvest.push(action.payload);
          return temp;
        } else return field;
      });
    },
    deleteHarvest: (state, action) => {
      state.field = state.field.reduce((result, current) => {
        if (current.id === action.payload.farmland) {
          let temp = current;
          temp.harvest = temp.harvest.filter(
            (harvest) => harvest.id !== action.payload.id
          );
          result.push(temp);
        } else {
          result.push(current);
        }
        return result;
      }, []);
    },
  },
});

const { actions, reducer } = userSlice;
// Extract and export each action creator by name
export const {
  login,
  logout,
  setField,
  addField,
  deleteField,
  editField,
  addFertilizer,
  deleteFertilizer,
  addPesticide,
  deletePesticide,
  addHarvest,
  deleteHarvest,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;
