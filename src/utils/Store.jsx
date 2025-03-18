import { configureStore } from "@reduxjs/toolkit";
import toggleSlice from "./ToggleSlice";
import taskSlice from "./TaskSlice";
import DesSlice from "./DesSlice";
import CountSlice from "./CountSlice";

const store = configureStore({
  reducer: {
    header: toggleSlice,
    task: taskSlice,
    des: DesSlice,
    count: CountSlice,
  },
});

export default store;
