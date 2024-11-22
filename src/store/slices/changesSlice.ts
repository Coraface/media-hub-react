// src/store/mediaSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const changesSlice = createSlice({
  name: "changes",
  initialState: {
    hasChanged: false,
  },
  reducers: {
    setMediaChanged: (state, action: { payload: boolean }) => {
      state.hasChanged = action.payload;
    },
  },
});

export const { setMediaChanged } = changesSlice.actions;
export const changesReducer = changesSlice.reducer;
