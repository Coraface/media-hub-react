import React, { useEffect, useState } from "react";
import {
  useFetchFriendRequestsQuery,
  useHandleFriendRequestMutation,
} from "../../store";
import { skipToken } from "@reduxjs/toolkit/query";
import Button from "../buttons/Button";
import { FriendRequest } from "../../api/types/friendRequest";
import FriendCard from "./FriendCard";
import { User } from "../../api/types/user";
import AcceptFriendRequest from "../buttons/AcceptFriendRequest";
import RejectFriendRequest from "../buttons/RejectFriendRequest";
import AcceptRejectFlex from "../buttons/AcceptRejectFlex";

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
    keycloakUsername
      ? { username: keycloakUsername, type: "received" }
      : skipToken
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

  const requesters: User[] = (friendRequests ?? []).map(
    (request) => request.requester
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Friend Requests
      </h2>
      {isLoadingRequests ? (
        <p>Loading requests...</p>
      ) : friendRequests?.length === 0 ? (
        <p className="text-gray-600">No requests.</p>
      ) : (
        <ul className="space-y-4" id="friends-list">
          {requesters?.map((requester: User) => (
            <li
              key={requester.userName}
              className="flex flex-wrap items-center justify-between border-b pb-4 last:border-b-0 gap-4"
            >
              <FriendCard
                key={requester.userName}
                friend={requester}
                size="small"
              />
              <AcceptRejectFlex
                friendRequestActionResults={friendRequestActionResults}
                handleFriendRequest={handleFriendRequest}
                requester={requester.userName}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;
