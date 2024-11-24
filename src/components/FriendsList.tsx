import React, { useEffect, useState } from "react";
import { useFetchFriendshipsQuery } from "../store";
import { skipToken } from "@reduxjs/toolkit/query";
import { Link } from "react-router-dom";

interface Friend {
  userName: string;
  fullName: string;
  email: string;
  photoUri: string;
  bio: string;
}

interface FriendsListProps {
  username: string | undefined;
}

const FriendsList: React.FC<FriendsListProps> = ({ username }) => {
  const [keycloakUsername, setUsername] = useState<string | undefined>(
    username
  );

  useEffect(() => {
    console.log(keycloakUsername);
    setUsername(username);
  }, [keycloakUsername, username]);

  const {
    data: friends,
    isLoading: isLoadingFriends,
    error: errorFriends,
  } = useFetchFriendshipsQuery(keycloakUsername ? keycloakUsername : skipToken);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Friends</h2>
      {isLoadingFriends ? (
        <p>Loading friends...</p>
      ) : friends?.length === 0 ? (
        <p className="text-gray-600">No friends available.</p>
      ) : (
        <ul className="space-y-4" id="friends-list">
          {friends?.map((friend: Friend) => (
            <li
              key={friend.userName}
              className="flex items-center justify-between border-b pb-4 last:border-b-0"
            >
              <Link
                to={`/profile/${friend.userName}`}
                className="friend-link text-blue-500 hover:underline"
              >
                <strong>{friend.userName}</strong>
              </Link>
              {/* {keycloakUsername === userParam && (
          <button
            className="remove bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
            onClick={() => removeFriend(friend.userName)}
          >
            Remove
          </button>
              )} */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
