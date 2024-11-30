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
    <div className="flex flex-col space-y-10">
      <div className="flex max-w-lg justify-center items-center">
        <FriendSearchBar />
      </div>

      {/* Friend Requests */}
      {username === keycloak.tokenParsed?.preferred_username && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <FriendRequests username={username} />
        </div>
      )}

      {/* Friends List */}
      <FriendsList username={username} />
    </div>
  );
};

export default FriendsSection;
