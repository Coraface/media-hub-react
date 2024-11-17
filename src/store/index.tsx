import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { tmdbApi } from "./apis/tmdbApi";
import { mediaApi } from "./apis/mediaApi";

export const store = configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbApi.middleware, mediaApi.middleware),
});

setupListeners(store.dispatch);
export { useSearchMediaQuery, useFetchMediaDetailsQuery } from "./apis/tmdbApi";
export {
  useFetchMediaStatusQuery,
  useAddWantedMediaMutation,
  useAddFinishedMediaMutation,
  useRemoveWantedMediaMutation,
  useRemoveFinishedMediaMutation,
} from "./apis/mediaApi";
