import React from "react";
import FriendRequests from "./FriendRequests.tsx";
import FriendsList from "./FriendsList";
import keycloak from "../../keycloak/keycloak.ts";

interface FriendsSectionProps {
  username: string | undefined;
}

const FriendsSection: React.FC<FriendsSectionProps> = ({ username }) => {
  return (
    <>
      {/* Friend Requests */}
      {username === keycloak.tokenParsed?.preferred_username && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <FriendRequests username={username} />
        </div>
      )}

      {/* Friends List */}
      <FriendsList username={username} />
    </>
  );
};

export default FriendsSection;
