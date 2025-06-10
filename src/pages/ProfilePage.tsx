import { useEffect, useState } from "react";
import useKeycloakAuth from "../hooks/useKeycloakAuth";
import {
  useFetchWantedMediaQuery,
  useFetchFinishedMediaQuery,
  useFetchUserQuery,
  useFetchFriendshipsQuery,
  useFetchFriendRequestsQuery,
  useRemoveFriendshipMutation,
  useHandleFriendRequestMutation,
} from "../store";
import type { Media } from "../api/types/media";
import { FetchBaseQueryError, skipToken } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { setMediaChanged } from "../store/slices/changesSlice";
import MediaSection from "../components/media/MediaSection";
import { useGetQueryParam } from "../hooks/useGetQueryParam";
import FriendsSection from "../components/friend/FriendsSection";
import ProfileSideHeader from "../components/buttons/ProfileSideHeader";

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
  const { data: user } = useFetchUserQuery(username ? username : skipToken);

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
  const { data: receivedFriendRequests } = useFetchFriendRequestsQuery(
    keycloakUsername
      ? { username: keycloakUsername, type: "received" }
      : skipToken
  );

  // Fetch friends for the user whose profile is being viewed
  const { data: friends } = useFetchFriendshipsQuery(
    keycloakUsername ? keycloakUsername : skipToken
  );
  console.log(friends, receivedFriendRequests);

  const [friendRequestAction, friendRequestActionResults] =
    useHandleFriendRequestMutation();

  const handleFriendRequest = async (requester: string, isAccept: string) => {
    await friendRequestAction({
      username: keycloakUsername as string,
      friendUsername: requester,
      status: isAccept,
    }).unwrap();
  };

  const [removeFriend, removeFriendResults] = useRemoveFriendshipMutation();

  useEffect(() => {
    if (friends) {
      setIsFriend(friends.some((friend) => friend.userName === username));
    }
  }, [friends, username]);

  const handleRemoveFriend = async () => {
    await removeFriend({
      username: keycloakUsername as string,
      friendUsername: username as string,
    }).unwrap();

    if (removeFriendResults.isSuccess) {
      setIsFriend(false);
    }
  };

  // Local state to track the friend/request status
  const [isFriend, setIsFriend] = useState(false);

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
    username === undefined ||
    keycloakUsername === undefined ||
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
          <div className="flex flex-wrap items-center space-x-4 gap-y-4">
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

          {/* Side Header Section */}
          <ProfileSideHeader
            username={username}
            keycloakUsername={keycloakUsername}
            friendRequests={receivedFriendRequests}
            friendRequestActionResults={friendRequestActionResults}
            handleFriendRequest={handleFriendRequest}
            isFriend={isFriend}
            handleRemoveFriend={handleRemoveFriend}
          />
        </div>

        {/* Main Content */}
        <h1 className="mt-8 flex justify-start text-2xl font-bold text-gray-800">
          {username === keycloakUsername ? "" : `${username}'s`} Interests
        </h1>
        <div className="mt-8 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-10 gap-y-8">
          {/* Media Section */}
          <MediaSection
            wantedMovies={wantedMovies}
            wantedSeries={wantedSeries}
            finishedMovies={finishedMovies}
            finishedSeries={finishedSeries}
          />
        </div>

        {/* Friends Section */}
        <h1 className="mt-20 flex justify-start text-2xl font-bold text-gray-800">
          {username === keycloakUsername ? "" : `${username}'s`} Friends
        </h1>
        <div className="mt-8 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-10 gap-y-8">
          <FriendsSection username={username} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
