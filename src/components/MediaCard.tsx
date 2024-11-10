import { Link } from "react-router-dom";
import { Media } from "../api/types/media";
import theMovieDb from "../scripts/themoviedb";

export default function MediaCard({ media }: { media: Media }) {
  return (
    <Link
      to={`/media-details?id=${media.id}&media-type=${media.media_type}`}
      className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <img
        className="object-cover w-full rounded-t-lg h-96 transition-opacity duration-300 hover:opacity-70 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
        src={`${theMovieDb.common.images_uri}w500${media.poster_path}`}
        alt={media.title}
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
          {media.title}
        </h5>
        <p className="mb-1 text-md font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
          ({media.release_date}) | {media.genres}
        </p>
        <p className="text-sm font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
          {media.overview}
        </p>
      </div>
    </Link>
  );
}
