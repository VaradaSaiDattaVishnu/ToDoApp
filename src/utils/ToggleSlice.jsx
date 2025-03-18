import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
  name: "header",
  initialState: {
    isToggle: true,
  },

  reducers: {
    setToggle: (state) => {
      state.isToggle = !state.isToggle;
    },
  },
});

export default headerSlice.reducer;
export const { setToggle } = headerSlice.actions;
