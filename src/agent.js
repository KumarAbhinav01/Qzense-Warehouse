import axios from "axios";

const baseURL = "http://65.0.56.125:8000";

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const tokenPlugin = (token) => {
  return {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
};

const Auth = {
  // getUser: (token) => instance.post("/api/user/login/", tokenPlugin(token)),
  
  // register: (registerData) => instance.post("/api/user/register/", registerData),
  register: async (registerData) => {
    try{
      const response = await instance.post("/api/user/register/", registerData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  validatePhone: async (phoneNumber) => {
    try {
      const response = await instance.post(
        "/api/user/phone_validation/",
        { phone : phoneNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Validation Part Executed !")
      return response;
    } catch (error) {
      throw error;
    }
  },


  // login: (loginData) => instance.post("/api/user/login/", loginData),
  login: async (loginData) => {
    try {
      const response = await instance.post("/api/user/login/", loginData);
      const { token } = response.data;
      localStorage.setItem("accessToken", token.access);
      localStorage.setItem("refreshToken", token.refresh);
      tokenPlugin(token.access);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // otp: (code) => instance.post("/api/user/verify_otp/", { otp: code }),
  otp: async (otp) => {
    try {
      const response = await instance.post(
        "/api/user/verify_otp/",
        { otp: otp },
        {
          headers: {
            "X-Cookie": document.cookie,
          },
        }
      );
      // Handle the response or extract data if needed
      console.log(response);
      return response;
    } catch (error) {
      throw error;
    }
  },  
  
  activate: (uid, token) =>
    instance.post("/auth/users/activation/", { uid, token }),
  resetPassword: (phone) =>
    instance.post("/auth/verify/phno/", { phone_number: phone }),
  confirmResetPassowrd: (data) => instance.post("/auth/change/password/", data),
};

const Truck = {
  number: async (file) => {
    try {
      const formData = new FormData();
      formData.append("picture", file);
      const response = await instance.post("/api/text_rekognition/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const truckNumber = response.data;
      console.log(truckNumber);
      return truckNumber;
    } catch (error) {
      throw error;
    }
  },
}

const Field = {
  add: (fieldData) => instance.post("/farmListCreate/", fieldData),
  retrieve: (id, token) =>
    instance.get(`/farmRetriveUpdateDestroy/${id}`, tokenPlugin(token)),
  delete: (id, token) =>
    instance.delete(`/farmRetriveUpdateDestroy/${id}/`, tokenPlugin(token)),
  update: (id, fieldData, token) =>
    instance.put(
      `/farmRetriveUpdateDestroy/${id}/`,
      fieldData,
      tokenPlugin(token)
    ),
};

const Harvest = {
  add: (fieldData) => instance.post("/HarvestListCreate/", fieldData),
  retrieve: (id, token) =>
    instance.get(`/HarvestRetriveUpdateDestroy/${id}`, tokenPlugin(token)),
  delete: (id, token) =>
    instance.delete(`/HarvestRetriveUpdateDestroy/${id}/`, tokenPlugin(token)),
  update: (id, fieldData, token) =>
    instance.put(
      `/HarvestRetriveUpdateDestroy/${id}/`,
      fieldData,
      tokenPlugin(token)
    ),
};

const Pesticide = {
  add: (fieldData) => instance.post("/PesticideListCreate/", fieldData),
  retrieve: (id, token) =>
    instance.get(`/PesticideRetriveUpdateDestroy/${id}`, tokenPlugin(token)),
  delete: (id, token) =>
    instance.delete(
      `/PesticideRetriveUpdateDestroy/${id}/`,
      tokenPlugin(token)
    ),
  update: (id, fieldData, token) =>
    instance.put(
      `/PesticideRetriveUpdateDestroy/${id}/`,
      fieldData,
      tokenPlugin(token)
    ),
};

const Fertilizer = {
  add: (fieldData) => instance.post("/fertiliserListCreate/", fieldData),
  retrieve: (id, token) =>
    instance.get(`/fertiliserRetriveUpdateDestroy/${id}`, tokenPlugin(token)),
  delete: (id, token) =>
    instance.delete(
      `/fertiliserRetriveUpdateDestroy/${id}/`,
      tokenPlugin(token)
    ),
  update: (id, fieldData, token) =>
    instance.put(
      `/fertiliserRetriveUpdateDestroy/${id}/`,
      fieldData,
      tokenPlugin(token)
    ),
};

export default { Auth, Field, Harvest, Pesticide, Fertilizer, instance };
