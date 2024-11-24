import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { tmdbApi } from "./apis/tmdbApi";
import { mediaApi } from "./apis/mediaApi";
import { friendshipApi } from "./apis/friendshipApi";
import { changesReducer } from "./slices/changesSlice";
import { userApi } from "./apis/userApi";

export const store = configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [friendshipApi.reducerPath]: friendshipApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    changes: changesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      tmdbApi.middleware,
      mediaApi.middleware,
      friendshipApi.middleware,
      userApi.middleware
    ),
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
export {
  useFetchFriendRequestsQuery,
  useFetchFriendshipsQuery,
  useSendFriendRequestMutation,
  useHandleFriendRequestMutation,
  useRemoveFriendshipMutation,
} from "./apis/friendshipApi";
export { useFetchUserQuery } from "./apis/userApi";
