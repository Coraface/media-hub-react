import React from "react";
import FriendRequests from "./FriendRequests.tsx";
import FriendsList from "./FriendsList";
import keycloak from "../../keycloak/keycloak.ts";
import { FriendSearchBar } from "./FriendSearchBar.tsx";

interface FriendsSectionProps {
  username: string | undefined;
}

const FriendsSection: React.FC<FriendsSectionProps> = ({ username }) => {
  return (
    <div className="flex flex-col justify-between">
      <div className="w-80 max-w-lg">
        <FriendSearchBar />
      </div>

      {/* Friend Requests */}
      {username === keycloak.tokenParsed?.preferred_username && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <FriendRequests username={username} />
        </div>
      )}

      {/* Friends List */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <FriendsList
          username={username}
          keycloakUser={keycloak.tokenParsed?.preferred_username}
        />
      </div>
    </div>
  );
};

export default FriendsSection;
