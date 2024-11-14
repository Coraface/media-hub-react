import MediaCardLabels from "../components/MediaCardLabel";
import {
  useFetchMediaDetailsQuery,
  useFetchMediaStatusQuery,
  useAddMediaMutation,
  useRemoveMediaMutation,
} from "../store";
import { Media } from "../api/types/media";
import Button from "../components/Button";
import { useState } from "react";

interface MediaStatusResponse {
  isWanted: boolean;
  isFinished: boolean;
}

const getQueryParam = (param: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  const term = urlParams.get(param);

  if (!term) {
    throw new Error(`No search term found`);
  }
  return term;
};

export default function MediaDetailsPage() {
  const id: string = getQueryParam("id");
  const mediaType: string = getQueryParam("media-type");

  // true if button should add, false if button should remove
  const [wantedButtonStatus, setWantedButtonStatus] = useState<boolean | null>(
    null
  );
  const [finishedButtonStatus, setFinishedButtonStatus] = useState<
    boolean | null
  >(null);

  const { data, error, isLoading } = useFetchMediaDetailsQuery({
    id,
    mediaType,
  });

  const {
    data: statusData,
    error: error2,
    isLoading: isLoading2,
  } = useFetchMediaStatusQuery({
    mediaType,
    mediaId: parseInt(id),
  });
  console.log(statusData, error2, isLoading2);

  const [addMedia, addMediaResults] = useAddMediaMutation();
  const [removeMedia, removeMediaResults] = useRemoveMediaMutation();

  const handleAddMedia = (data: Media, status: "wanted" | "finished") => {
    if (status === "wanted") {
      setWantedButtonStatus(false);
    } else {
      setFinishedButtonStatus(false);
    }
    setFinishedButtonStatus(status !== "finished");
    addMedia({ media: data, status });
  };

  const handleRemoveMedia = (data: Media, status: "wanted" | "finished") => {
    if (status === "wanted") {
      setWantedButtonStatus(true);
    } else {
      setFinishedButtonStatus(true);
    }
    removeMedia({
      id: data.id,
      mediaType: data.media_type === "movie" ? "movies" : "series",
      status,
    });
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
                ? removeMediaResults.isLoading
                : addMediaResults.isLoading
            }
            onClick={() =>
              data &&
              (wantedButtonStatus
                ? handleAddMedia(data, "wanted")
                : handleRemoveMedia(data, "wanted"))
            }
            className="px-5 py-2 border border-white rounded-full text-white text-md transition-shadow bg-transparent duration-300 hover:shadow-[0_0_0_3px_#fff]"
          >
            {wantedButtonStatus ? "Add to Wanted" : "Remove from Wanted"}
          </Button>
          <Button
            loading={
              finishedButtonStatus
                ? removeMediaResults.isLoading
                : addMediaResults.isLoading
            }
            onClick={() =>
              data &&
              (finishedButtonStatus
                ? handleAddMedia(data, "finished")
                : handleRemoveMedia(data, "finished"))
            }
            className="px-5 py-2 border border-white rounded-full text-white text-md transition-shadow bg-transparent duration-300 hover:shadow-[0_0_0_3px_#fff]"
          >
            {finishedButtonStatus ? "Add to Finished" : "Remove from Finished"}
          </Button>
        </div>
      </div>
    </div>
  );
}
