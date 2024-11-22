import React, { useEffect, useState } from "react";
import useKeycloakAuth from "../hooks/useKeycloakAuth";
import { useFetchWantedMediaQuery, useFetchFinishedMediaQuery } from "../store";
import MediaCard from "../components/MediaCard";
import type { Media } from "../api/types/media";
import { FetchBaseQueryError, skipToken } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { setMediaChanged } from "../store/slices/changesSlice";
import MediaSection from "../components/MediaSection";

interface MediaResponse {
  data: Media[];
  error: FetchBaseQueryError;
  isLoading: never;
}

const ProfilePage = () => {
  const { keycloak, initialized } = useKeycloakAuth();
  const dispatch = useDispatch();
  const hasChanged = useSelector((state: any) => state.changes.hasChanged);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (keycloak.tokenParsed?.preferred_username) {
      setUsername(keycloak.tokenParsed.preferred_username);
    }
  }, [keycloak.tokenParsed]);

  // RTK Query to get the wanted and finished media
  const {
    data: wantedMovies,
    isLoading: isLoadingWantedMovies,
    error: errorWantedMovies,
    refetch: refetchWantedMovies,
  } = useFetchWantedMediaQuery<MediaResponse>(username ? "movies" : skipToken);
  const {
    data: wantedSeries,
    isLoading: isLoadingWantedSeries,
    error: errorWantedSeries,
    refetch: refetchWantedSeries,
  } = useFetchWantedMediaQuery<MediaResponse>(username ? "series" : skipToken);
  const {
    data: finishedMovies,
    isLoading: isLoadingFinishedMovies,
    error: errorFinishedMovies,
    refetch: refetchFinishedMovies,
  } = useFetchFinishedMediaQuery<MediaResponse>(
    username ? "movies" : skipToken
  );
  const {
    data: finishedSeries,
    isLoading: isLoadingFinishedSeries,
    error: errorFinishedSeries,
    refetch: refetchFinishedSeries,
  } = useFetchFinishedMediaQuery<MediaResponse>(
    username ? "series" : skipToken
  );

  useEffect(() => {
    if (hasChanged) {
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
        <div className="flex items-center space-x-4">
          <img
            src={
              keycloak.tokenParsed?.avatarUrl ||
              "https://via.placeholder.com/150"
            }
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {keycloak.tokenParsed?.preferred_username || "John Doe"}
            </h1>
            <p className="text-gray-600">{keycloak.tokenParsed?.email}</p>
          </div>
        </div>

        {/* Media Sections */}
        <div className="mt-8 space-y-10">
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
      </div>
    </div>
  );
};

export default ProfilePage;
