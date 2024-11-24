import React, { useEffect, useState } from "react";
import {
  useFetchFriendshipsQuery,
  useRemoveFriendshipMutation,
} from "../store";
import { skipToken } from "@reduxjs/toolkit/query";
import { Link } from "react-router-dom";
import Button from "./Button";
import { User } from "../api/types/user";

interface FriendsListProps {
  username: string | undefined;
  keycloakUser: string | undefined;
}

const FriendsList: React.FC<FriendsListProps> = ({
  username,
  keycloakUser,
}) => {
  const [user, setUsername] = useState<string | undefined>(username);
  const [localFriends, setLocalFriends] = useState<User[] | undefined>([]);

  useEffect(() => {
    setUsername(username);
  }, [username]);

  const {
    data: friends,
    isLoading: isLoadingFriends,
    error: errorFriends,
  } = useFetchFriendshipsQuery(user ? user : skipToken);

  useEffect(() => {
    if (friends) {
      setLocalFriends(friends);
    }
  }, [friends]);

  const [removeFriend, removeFriendResults] = useRemoveFriendshipMutation();

  const handleRemoveFriend = async (friend: User) => {
    const result = await removeFriend({
      username: keycloakUser as string,
      friendUsername: friend.userName,
    }).unwrap();

    if (result) {
      setLocalFriends((prev) =>
        prev?.filter((f) => f.userName !== friend.userName)
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Friends</h2>
      {isLoadingFriends ? (
        <p>Loading friends...</p>
      ) : localFriends?.length === 0 ? (
        <p className="text-gray-600">No friends available.</p>
      ) : (
        <ul className="space-y-4" id="friends-list">
          {localFriends?.map((friend: User) => (
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
              {user === keycloakUser && username && (
                <Button
                  loading={removeFriendResults.isLoading}
                  onClick={() => handleRemoveFriend(friend)}
                  className="remove bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Remove
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
