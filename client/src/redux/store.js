import { configureStore } from "@reduxjs/toolkit";
import serviceSlice from "./slice.js";
import { serviceAPI } from "./service.js";

export default configureStore({
  reducer: {
    service: serviceSlice,
    [serviceAPI.reducerPath]: serviceAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      serviceAPI.middleware
    ),
});
