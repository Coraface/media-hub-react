import MediaCardLabels from "../components/MediaCardLabel";
import {
  useFetchMediaDetailsQuery,
  useFetchMediaStatusQuery,
  useAddWantedMediaMutation,
  useAddFinishedMediaMutation,
  useRemoveWantedMediaMutation,
  useRemoveFinishedMediaMutation,
} from "../store";
import { Media } from "../api/types/media";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { useDispatch } from "react-redux";
import { setMediaChanged } from "../store/slices/changesSlice";
import { useGetQueryParam } from "../hooks/useGetQueryParam";
import keycloak from "../keycloak/keycloak";

interface MediaStatusResponse {
  data: {
    isWanted: boolean;
    isFinished: boolean;
  };
  error: FetchBaseQueryError;
  isLoading: never;
}

export default function MediaDetailsPage() {
  const dispatch = useDispatch();
  const username = keycloak.tokenParsed?.preferred_username;
  const id: string = useGetQueryParam("id", false);
  const mediaType: string = useGetQueryParam("media-type", false);

  const { data, error, isLoading } = useFetchMediaDetailsQuery({
    id,
    mediaType,
  });

  const {
    data: statusData,
    error: error2,
    isLoading: isLoading2,
  } = useFetchMediaStatusQuery<MediaStatusResponse>({
    username: username, // replace with the actual username
    mediaType,
    mediaId: parseInt(id),
  });
  console.log(statusData, error2, isLoading2);

  // true if button should add, false if button should remove
  const [wantedButtonStatus, setWantedButtonStatus] = useState<boolean | null>(
    null
  );
  const [finishedButtonStatus, setFinishedButtonStatus] = useState<
    boolean | null
  >(null);

  console.log("Buttons", wantedButtonStatus, finishedButtonStatus);

  // Set button status when fetched data is available
  useEffect(() => {
    if (statusData) {
      setWantedButtonStatus(statusData.isWanted);
      setFinishedButtonStatus(statusData.isFinished);
    }
  }, [statusData]);

  const [addWantedMedia, addWantedMediaResults] = useAddWantedMediaMutation();
  const [addFinishedMedia, addFinishedMediaResults] =
    useAddFinishedMediaMutation();
  const [removeWantedMedia, removeWantedMediaResults] =
    useRemoveWantedMediaMutation();
  const [removeFinishedMedia, removeFinishedMediaResults] =
    useRemoveFinishedMediaMutation();

  useEffect(() => {
    if (addWantedMediaResults.isSuccess) {
      setWantedButtonStatus(true);
      addWantedMediaResults.reset();
      dispatch(setMediaChanged(true));
    }
    if (addFinishedMediaResults.isSuccess) {
      setFinishedButtonStatus(true);
      addFinishedMediaResults.reset();
      dispatch(setMediaChanged(true));
    }

    if (removeWantedMediaResults.isSuccess) {
      setWantedButtonStatus(false);
      removeWantedMediaResults.reset();
      dispatch(setMediaChanged(true));
    }
    if (removeFinishedMediaResults.isSuccess) {
      setFinishedButtonStatus(false);
      removeFinishedMediaResults.reset();
      dispatch(setMediaChanged(true));
    }
  }, [
    addWantedMediaResults,
    addFinishedMediaResults,
    removeWantedMediaResults,
    removeFinishedMediaResults,
    dispatch,
  ]);

  const handleAddMedia = (data: Media, status: "wanted" | "finished") => {
    if (status === "wanted") {
      addWantedMedia({ media: data, status });
    } else {
      addFinishedMedia({ media: data, status });
    }
  };

  const handleRemoveMedia = (data: Media, status: "wanted" | "finished") => {
    if (status === "wanted") {
      removeWantedMedia({
        id: data.id,
        mediaType: data.media_type === "movie" ? "movies" : "series",
        status,
      });
    } else {
      removeFinishedMedia({
        id: data.id,
        mediaType: data.media_type === "movie" ? "movies" : "series",
        status,
      });
    }
  };

  const info = [
    { label: "GENRE", value: data?.genre },
    { label: "RATING", value: data?.rating },
    { label: "YEAR", value: data?.year },
    { label: "DESCRIPTION", value: data?.overview },
    { label: "DIRECTOR", value: data?.director },
    { label: "DURATION", value: data?.durationMinutes },
    { label: "EPISODES", value: data?.episodes },
    { label: "SEASONS", value: data?.seasons },
  ];
  const renderedLabels = info.map((info) => {
    if (info.value) {
      return (
        <MediaCardLabels
          key={info.label}
          label={info.label}
          value={info.value}
        />
      );
    }
  });

  return (
    <div
      className="relative w-full min-h-screen flex items-start justify-center bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${data?.backdrop_path})` }}
    >
      {/* Overlay for shadow effect */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Container for content */}
      <div className="relative flex flex-col max-w-7xl p-6 text-white space-y-8 mt-10">
        {/* Title and Buttons */}
        <div className="flex items-center justify-between">
          <h1 className="text-[3rem] text-white">{data?.title}</h1>
        </div>

        {/* Data details in column format */}
        <div className="flex flex-col w-full md:w-1/2 space-y-6">
          {renderedLabels}
        </div>
        <div className="flex gap-4 mt-500">
          <Button
            loading={
              wantedButtonStatus
                ? removeWantedMediaResults.isLoading
                : addWantedMediaResults.isLoading
            }
            onClick={() =>
              data &&
              (wantedButtonStatus
                ? handleRemoveMedia(data, "wanted")
                : handleAddMedia(data, "wanted"))
            }
            className="px-5 py-2 border border-white rounded-full text-white text-md transition-shadow bg-transparent duration-300 hover:shadow-[0_0_0_3px_#fff]"
          >
            {wantedButtonStatus ? "Remove from Wanted" : "Add to Wanted"}
          </Button>
          <Button
            loading={
              finishedButtonStatus
                ? removeFinishedMediaResults.isLoading
                : addFinishedMediaResults.isLoading
            }
            onClick={() =>
              data &&
              (finishedButtonStatus
                ? handleRemoveMedia(data, "finished")
                : handleAddMedia(data, "finished"))
            }
            className="px-5 py-2 border border-white rounded-full text-white text-md transition-shadow bg-transparent duration-300 hover:shadow-[0_0_0_3px_#fff]"
          >
            {finishedButtonStatus ? "Remove from Finished" : "Add to Finished"}
          </Button>
        </div>
      </div>
    </div>
  );
}
