import { useEffect, useState } from "react";
import keycloak from "../keycloak/keycloak.ts";

export default function useGetKeycloakUser(): string {
  const [username, setUsername] = useState<string | undefined>(
    keycloak.tokenParsed?.preferred_username
  );

  useEffect(() => {
    const updateUsername = () => {
      if (keycloak.authenticated) {
        setUsername(keycloak.tokenParsed?.preferred_username);
      }
    };

    keycloak.onAuthSuccess = updateUsername;
    keycloak.onAuthError = updateUsername;

    // Check if already authenticated
    if (keycloak.authenticated) {
      updateUsername();
    }

    return () => {
      keycloak.onAuthSuccess = undefined;
      keycloak.onAuthError = undefined;
    };
  }, []);

  return username || "";
}
