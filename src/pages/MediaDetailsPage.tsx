import { Media } from "../api/types/media";
import { useFetchMediaDetailsQuery } from "../store";
import theMovieDb from "../scripts/themoviedb";
import { describe } from "node:test";
import MediaCardLabels from "../components/MediaCardLabel";

const getQueryParam = (param: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  const term = urlParams.get(param);

  if (!term) {
    throw new Error(`No search term found`);
  }
  return term;
};

export default function MediaDetailsPage() {
  const id = getQueryParam("id");
  const mediaType = getQueryParam("media-type");
  const { data, error, isLoading } = useFetchMediaDetailsQuery({
    id,
    mediaType,
  });
  console.log(data, error, isLoading);
  const info = [
    { label: "GENRE", value: data?.genres },
    { label: "RATING", value: data?.vote_average },
    { label: "YEAR", value: data?.release_date },
    { label: "DESCRIPTION", value: data?.overview },
    { label: "DIRECTOR", value: data?.director },
    { label: "DURATION", value: data?.runtime },
    { label: "EPISODES", value: data?.number_of_episodes },
    { label: "SEASONS", value: data?.number_of_seasons },
  ];
  const renderedLabels = info.map((info) => {
    if (info.value) {
      return <MediaCardLabels label={info.label} value={info.value} />;
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
      <div className="relative flex flex-col w-full max-w-7xl p-6 text-white space-y-8 mt-10">
        {/* Title and Buttons */}
        <div className="flex items-center justify-between">
          <h1 className="text-[4rem] text-white">{data?.title}</h1>
          <div className="flex gap-4">
            <button className="px-5 py-2 border border-white rounded-full text-white text-md transition-shadow bg-transparent duration-300 hover:shadow-[0_0_0_3px_#fff]">
              Add to WatchList
            </button>
            <button className="px-5 py-2 border border-white rounded-full text-white text-md transition-shadow bg-transparent duration-300 hover:shadow-[0_0_0_3px_#fff]">
              Add to Finished
            </button>
          </div>
        </div>

        {/* Data details in column format */}
        <div className="flex flex-col w-full md:w-1/2 space-y-6">
          {renderedLabels}
        </div>
      </div>
    </div>
  );
}
