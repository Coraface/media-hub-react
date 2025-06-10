import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import keycloak from "../../keycloak/keycloak.ts";
import { User } from "../../api/types/user.ts";

const apiBaseUrl: string = "";
const getBaseUserUrl = (username: string) => {
  return `${apiBaseUrl}/api/users?user=${username}`;
};

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  endpoints: (builder) => ({
    fetchUser: builder.query<User, string>({
      query: (username: string) => ({
        method: "GET",
        headers: {
          Authorization: "Bearer " + keycloak.token,
          "Content-Type": "application/json",
        },
        url: getBaseUserUrl(username),
      }),
    }),
  }),
});

export const { useFetchUserQuery } = userApi;
export { userApi };
