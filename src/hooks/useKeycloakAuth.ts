import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

export default function useKeycloakAuth() {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) {
      console.log("Initializing Keycloak");
    } else if (!keycloak.authenticated) {
      console.log("User is not authenticated");
      navigate("/");
    } else {
      console.log(
        "User",
        keycloak.tokenParsed?.preferred_username,
        "is authenticated"
      );
    }
  }, [
    initialized,
    keycloak.authenticated,
    keycloak.tokenParsed?.preferred_username,
    navigate,
  ]);

  return { keycloak, initialized };
}
