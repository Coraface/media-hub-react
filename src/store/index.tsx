import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { tmdbApi } from "./apis/tmdbApi";
import { mediaApi } from "./apis/mediaApi";
import { changesReducer } from "./slices/changesSlice";

export const store = configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    changes: changesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbApi.middleware, mediaApi.middleware),
});

setupListeners(store.dispatch);
export { useSearchMediaQuery, useFetchMediaDetailsQuery } from "./apis/tmdbApi";
export {
  useFetchMediaStatusQuery,
  useFetchWantedMediaQuery,
  useFetchFinishedMediaQuery,
  useAddWantedMediaMutation,
  useAddFinishedMediaMutation,
  useRemoveWantedMediaMutation,
  useRemoveFinishedMediaMutation,
} from "./apis/mediaApi";
