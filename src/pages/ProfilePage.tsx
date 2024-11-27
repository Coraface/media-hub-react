import React, { useEffect, useRef, useState } from "react";
import useKeycloakAuth from "../hooks/useKeycloakAuth";
import {
  useFetchWantedMediaQuery,
  useFetchFinishedMediaQuery,
  useFetchUserQuery,
  useSendFriendRequestMutation,
  useFetchFriendshipsQuery,
  useFetchFriendRequestsQuery,
} from "../store";
import type { Media } from "../api/types/media";
import { FetchBaseQueryError, skipToken } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { setMediaChanged } from "../store/slices/changesSlice";
import MediaSection from "../components/media/MediaSection";
import { useGetQueryParam } from "../hooks/useGetQueryParam";
import FriendsSection from "../components/friend/FriendsSection";
import Button from "../components/Button";
import { FriendRequest } from "../api/types/friendRequest";
import { FriendsProvider } from "../context/FriendContext";

interface MediaResponse {
  data: Media[];
  error: FetchBaseQueryError;
  isLoading: never;
}

const ProfilePage = () => {
  const { keycloak } = useKeycloakAuth();
  const dispatch = useDispatch();
  const usernameParam = useGetQueryParam("profile", true);
  const hasChanged = useSelector(
    (state: { changes: { hasChanged: boolean } }) => state.changes.hasChanged
  );
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [keycloakUsername, setKeycloakUsername] = useState<string | undefined>(
    undefined
  );

  // RTK Query for user
  const {
    data: user,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useFetchUserQuery(username ? username : skipToken);

  useEffect(() => {
    if (keycloak.tokenParsed?.preferred_username) {
      setKeycloakUsername(keycloak.tokenParsed.preferred_username);
      if (usernameParam === keycloak.tokenParsed.preferred_username) {
        setUsername(keycloak.tokenParsed.preferred_username);
      } else {
        setUsername(usernameParam);
      }
    }
  }, [keycloak.tokenParsed, username, usernameParam]);

  // RTK Queries for media
  const {
    data: wantedMovies,
    isLoading: isLoadingWantedMovies,
    error: errorWantedMovies,
    refetch: refetchWantedMovies,
  } = useFetchWantedMediaQuery<MediaResponse>(
    username ? { username, mediaType: "movies" } : skipToken
  );
  const {
    data: wantedSeries,
    isLoading: isLoadingWantedSeries,
    error: errorWantedSeries,
    refetch: refetchWantedSeries,
  } = useFetchWantedMediaQuery<MediaResponse>(
    username ? { username, mediaType: "series" } : skipToken
  );
  const {
    data: finishedMovies,
    isLoading: isLoadingFinishedMovies,
    error: errorFinishedMovies,
    refetch: refetchFinishedMovies,
  } = useFetchFinishedMediaQuery<MediaResponse>(
    username ? { username, mediaType: "movies" } : skipToken
  );
  const {
    data: finishedSeries,
    isLoading: isLoadingFinishedSeries,
    error: errorFinishedSeries,
    refetch: refetchFinishedSeries,
  } = useFetchFinishedMediaQuery<MediaResponse>(
    username ? { username, mediaType: "series" } : skipToken
  );

  // RTK Queries for friends
  // Fetch friend requests and friends
  const { data: friendRequests } = useFetchFriendRequestsQuery(
    keycloakUsername ? keycloakUsername : skipToken
  );
  const { data: friends } = useFetchFriendshipsQuery(
    keycloakUsername ? keycloakUsername : skipToken
  );
  console.log(friends, friendRequests);

  const [sendFriendRequest, sendFriendRequestResults] =
    useSendFriendRequestMutation();

  // Local state to track the friend/request status
  const [isFriend, setIsFriend] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

  // Sync local state with fetched data
  useEffect(() => {
    if (friends) {
      setIsFriend(friends.some((friend) => friend.userName === username));
    }
    if (friendRequests) {
      setIsRequestSent(
        friendRequests.some(
          (request) => request.requester.userName === username
        )
      );
    }
  }, [friends, friendRequests, username]);
  console.log(isFriend, isRequestSent);

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

  useEffect(() => {
    if (hasChanged && username === keycloakUsername) {
      if (username) {
        refetchWantedMovies();
        refetchWantedSeries();
        refetchFinishedMovies();
        refetchFinishedSeries();
        dispatch(setMediaChanged(false));
      }
    }
  }, [
    hasChanged,
    username,
    refetchWantedMovies,
    refetchWantedSeries,
    refetchFinishedMovies,
    refetchFinishedSeries,
    dispatch,
    keycloakUsername,
  ]);

  if (
    isLoadingWantedMovies ||
    isLoadingWantedSeries ||
    isLoadingFinishedMovies ||
    isLoadingFinishedSeries
  ) {
    return <p>Loading...</p>;
  }

  if (
    errorWantedMovies ||
    errorWantedSeries ||
    errorFinishedMovies ||
    errorFinishedSeries
  ) {
    return <p>Error loading media...</p>;
  }

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* User Info Header */}
        <div className="flex flex-wrap items-center gap-y-6 justify-between mb-[80px]">
          {/* User Details Section */}
          <div className="flex items-center space-x-4">
            <img
              src={user?.photoUri || "https://via.placeholder.com/150"}
              alt="User Avatar"
              className="w-60 h-60 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {username || "John Doe"}
              </h1>
              <p className="text-gray-600">{user?.fullName}</p>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {/* Buttons Section */}
          {username !== keycloakUsername && (
            <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
              <Button
                loading={sendFriendRequestResults?.isLoading}
                onClick={handleSendRequest}
                disabled={isRequestSent || isFriend}
                className="bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition"
              >
                {isFriend
                  ? "Already Friends"
                  : isRequestSent
                  ? "Request Sent"
                  : "+ Add Friend"}
              </Button>
            </div>
          )}
        </div>

        {/* Main Content: Media Sections + Friends Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Media Sections */}
          <div className="lg:col-span-2 space-y-10">
            {/* Wanted Media */}
            <MediaSection
              title="Wanted Movies"
              mediaData={wantedMovies}
              placeholderText="No wanted movies available."
              keyPrefix="wanted-movies"
              media_type="movie"
            />
            <MediaSection
              title="Wanted Series"
              mediaData={wantedSeries}
              placeholderText="No wanted series available."
              keyPrefix="wanted-series"
              media_type="tv"
            />

            {/* Finished Media */}
            <MediaSection
              title="Finished Movies"
              mediaData={finishedMovies}
              placeholderText="No finished movies available."
              keyPrefix="finished-movies"
              media_type="movie"
            />
            <MediaSection
              title="Finished Series"
              mediaData={finishedSeries}
              placeholderText="No finished series available."
              keyPrefix="finished-series"
              media_type="tv"
            />
          </div>

          {/* Friends Section */}
          <FriendsSection username={username} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
