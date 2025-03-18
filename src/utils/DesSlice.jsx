import { createSlice } from "@reduxjs/toolkit";

const DesSlice = createSlice({
  name: "des",
  initialState: {
    desTask: null,
  },

  reducers: {
    setDes: (state, action) => {
      state.desTask = action.payload;
    },
  },
});

export const { setDes } = DesSlice.actions;
export default DesSlice.reducer;
