import { createSlice } from "@reduxjs/toolkit";

const CountSlice = createSlice({
  name: "count",
  initialState: {
    pendingCount: `${0}`,
  },

  reducers: {
    increaseCount: (state, action) => {
      const token = action.payload;
      if (token === "pending") {
        let c = Number(state.pendingCount);
        c = c + 1;
        state.pendingCount = `${c}`;
      } 
    },

    decreaseCount: (state, action) => {
      const token = action.payload;
       if (token === "pending") {
        let c = Number(state.pendingCount);
        c = c - 1;
        state.pendingCount = `${c}`;
      }
    },

    setPendingCount: (state, action) => {
      const pendingL = action.payload;
      state.pendingCount = `${pendingL}`;
    },
  },
});

export const { increaseCount, decreaseCount, setPendingCount } =
  CountSlice.actions;
export default CountSlice.reducer;
