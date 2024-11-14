// // common.js
// import Keycloak, { KeycloakProfile } from "keycloak-js";
// const apiBaseUrl = "http://localhost:8081";

// type AuthenticatedCallback = (profile: KeycloakProfile) => void;

// function initializeKeycloak(
//   onAuthenticatedCallback: AuthenticatedCallback
// ): void {
//   keycloak
//     .init({ onLoad: "login-required" })
//     .then((authenticated) => {
//       if (authenticated) {
//         console.log("Authenticated");
//         localStorage.setItem("token", keycloak.token || "");
//         localStorage.setItem("refresh-token", keycloak.refreshToken || "");

//         keycloak.loadUserInfo().then((profile) => {
//           console.log("User profile: " + JSON.stringify(profile));
//           onAuthenticatedCallback(profile);
//         });

//         setInterval(() => {
//           keycloak
//             .updateToken(30)
//             .then((refreshed) => {
//               if (refreshed) {
//                 console.log("Token refreshed");
//               } else {
//                 const expirationTime = keycloak.tokenParsed?.exp
//                   ? keycloak.tokenParsed.exp + (keycloak.timeSkew || 0)
//                   : 0;
//                 const validForSeconds = Math.round(
//                   expirationTime - new Date().getTime() / 1000
//                 );
//                 console.warn(
//                   `Token not refreshed, valid for ${validForSeconds} seconds`
//                 );
//               }
//             })
//             .catch(() => {
//               console.log(
//                 "Failed to refresh the token, or the session has expired"
//               );
//               keycloak.clearToken();
//               window.location.reload();
//             });
//         }, 60000);
//       } else {
//         console.log("Not authenticated");
//         window.location.reload();
//       }
//     })
//     .catch(() => {
//       console.log("Failed to initialize Keycloak");
//       keycloak.logout({ redirectUri: apiBaseUrl });
//     });
// }
