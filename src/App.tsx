import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import HomePage from "./pages/HomePage";
import MediaDetailsPage from "./pages/MediaDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import { Provider } from "react-redux";
import { store } from "./store";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak/keycloak.ts";
import MediaSearchPage from "./pages/MediaSearchPage.tsx";
import { FriendSearch } from "./components/friend/FriendSearchBar.tsx";
import SearchPage from "./pages/SearchPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/search/*", element: <SearchPage /> },
      { path: "/profile/*", element: <ProfilePage /> },
    ],
  },
  { path: "/media-details", element: <MediaDetailsPage /> },
]);

export default function App() {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: "login-required" }}
    >
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ReactKeycloakProvider>
  );
}
