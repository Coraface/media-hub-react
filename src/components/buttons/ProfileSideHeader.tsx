import { useEffect, useState } from "react";
import { FriendRequest } from "../../api/types/friendRequest";
import { FriendSearchBar } from "../friend/FriendSearchBar";
import AcceptRejectFlex from "./AcceptRejectFlex";
import AddFriendButton from "./AddFriendButton";
import CancelFriendRequest from "./CancelFriendRequest";
import RemoveFriendButton from "./RemoveFriendButton";
import {
  useFetchFriendRequestsQuery,
  useSendFriendRequestMutation,
} from "../../store";
import { skipToken } from "@reduxjs/toolkit/query/react";

interface ProfileSideHeaderProps {
  username: string;
  keycloakUsername: string;
  friendRequests: FriendRequest[] | undefined;
  isFriend: boolean;
  friendRequestActionResults: { isLoading: boolean };
  handleFriendRequest: (requester: string, isAccept: string) => void;
  handleRemoveFriend: () => void;
}

export default function ProfileSideHeader({
  username,
  keycloakUsername,
  friendRequests,
  isFriend,
  friendRequestActionResults,
  handleFriendRequest,
  handleRemoveFriend,
}: ProfileSideHeaderProps) {
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [sendFriendRequest, sendFriendRequestResults] =
    useSendFriendRequestMutation();

  // Fetch sent friend requests for the logged in user
  const { data: sentFriendRequests } = useFetchFriendRequestsQuery(
    keycloakUsername ? { username: keycloakUsername, type: "sent" } : skipToken
  );

  // Sync local state with fetched data
  useEffect(() => {
    if (sentFriendRequests) {
      setIsRequestSent(
        sentFriendRequests.some(
          (request) =>
            (request.recipient.userName === username &&
              request.requester.userName === keycloakUsername) ||
            (request.recipient.userName === keycloakUsername &&
              request.requester.userName === username)
        )
      );
    }
  }, [sentFriendRequests, username, keycloakUsername]);

  // Handle send friend request
  const handleSendRequest = async () => {
    if (!isRequestSent && !isFriend && username && keycloakUsername) {
      await sendFriendRequest({
        username: keycloakUsername,
        friendUsername: username,
      });
      setIsRequestSent(true);
    }
  };
  let renderedSideHeader;
  const hasRequested = friendRequests?.some(
    (request) =>
      request.recipient.userName === keycloakUsername &&
      request.requester.userName === username
  );

  console.log(isFriend, isRequestSent, hasRequested);

  if (username === keycloakUsername) {
    console.log(username, keycloakUsername);
    renderedSideHeader = (
      <div className="flex max-w-lg justify-center items-center">
        <FriendSearchBar />
      </div>
    );
  } else if (username !== keycloakUsername) {
    if (!isFriend) {
      if (hasRequested) {
        // TODO: the recipient has to be in requester's profile
        // for this to appear, not the other way around
        renderedSideHeader = (
          <AcceptRejectFlex
            friendRequestActionResults={friendRequestActionResults}
            handleFriendRequest={handleFriendRequest}
            requester={username}
          />
        );
      } else {
        if (!isRequestSent) {
          renderedSideHeader = (
            <AddFriendButton
              sendFriendRequestResults={sendFriendRequestResults}
              handleSendRequest={handleSendRequest}
            />
          );
        } else {
          renderedSideHeader = (
            <CancelFriendRequest
              friendRequestActionResults={friendRequestActionResults}
              requester={username}
              handleFriendRequest={handleFriendRequest}
            />
          );
        }
      }
    } else {
      renderedSideHeader = (
        <RemoveFriendButton
          sendFriendRequestResults={sendFriendRequestResults}
          handleRemoveFriend={handleRemoveFriend}
          isFriend={isFriend}
          isRequestSent={isRequestSent}
        />
      );
    }
  }
  return renderedSideHeader;
}
