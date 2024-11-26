import React, { useEffect, useState } from "react";
import {
  useFetchFriendRequestsQuery,
  useHandleFriendRequestMutation,
} from "../../store";
import { skipToken } from "@reduxjs/toolkit/query";
import { Link } from "react-router-dom";
import Button from "../Button";
import { FriendRequest } from "../../api/types/friendRequest";

interface FriendsListProps {
  username: string | undefined;
}

const FriendRequests: React.FC<FriendsListProps> = ({ username }) => {
  const [keycloakUsername, setUsername] = useState<string | undefined>(
    username
  );
  const [friendRequests, setFriendRequests] = useState<
    FriendRequest[] | undefined
  >([]);

  useEffect(() => {
    console.log(keycloakUsername);
    setUsername(username);
  }, [keycloakUsername, username]);

  const {
    data: requests,
    isLoading: isLoadingRequests,
    error: errorRequests,
  } = useFetchFriendRequestsQuery(
    keycloakUsername ? keycloakUsername : skipToken
  );

  useEffect(() => {
    if (requests) {
      setFriendRequests(requests);
    }
  }, [requests]);

  const [friendRequestAction, friendRequestActionResults] =
    useHandleFriendRequestMutation();

  const handleFriendRequest = async (requester: string, isAccept: string) => {
    const result = await friendRequestAction({
      username: keycloakUsername as string,
      friendUsername: requester,
      status: isAccept,
    }).unwrap();

    if (result) {
      setFriendRequests((prev) =>
        prev?.filter((fr) => fr.requester.userName !== requester)
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Friend Requests
      </h2>
      {isLoadingRequests ? (
        <p>Loading requests...</p>
      ) : friendRequests?.length === 0 ? (
        <p className="text-gray-600">No requests.</p>
      ) : (
        <ul className="space-y-4" id="friends-list">
          {friendRequests?.map((request: FriendRequest) => (
            <li
              key={request.requester.userName}
              className="flex items-center justify-between border-b pb-4 last:border-b-0"
            >
              <Link
                to={`/profile/${request.requester.userName}`}
                className="friend-link text-blue-500 hover:underline"
              >
                <strong>{request.requester.userName}</strong>
              </Link>
              <Button
                loading={friendRequestActionResults?.isLoading}
                onClick={() =>
                  handleFriendRequest(request.requester.userName, "accepted")
                }
                className="remove text-white py-1 px-3 rounded hover:bg-green-600"
              >
                Accept
              </Button>
              <Button
                loading={friendRequestActionResults?.isLoading}
                onClick={() =>
                  handleFriendRequest(request.requester.userName, "rejected")
                }
                className="remove text-white py-1 px-3 rounded hover:bg-red-600"
              >
                Reject
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;
