import { Link } from "react-router-dom";
import { Media } from "../../api/types/media";

interface MediaCardProps {
  media: Media;
  size?: "small" | "regular"; // Control the size of the card
}

export default function MediaCard({ media, size }: MediaCardProps) {
  let cardClasses;
  if (size) cardClasses = "w-16 h-16 md:w-16 md:h-16"; // Small size for preview

  return (
    <Link
      to={`/media-details?id=${media.id}&media-type=${media.media_type}`}
      className={`flex items-center bg-white border border-gray-200 rounded-full shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 w-full max-w-xl overflow-hidden ${cardClasses}`}
    >
      {/* Media Image */}
      <img
        className={`flex-shrink-0 object-cover w-36 h-36 md:w-40 md:h-40 rounded-full transition-opacity duration-300 hover:opacity-70 ${cardClasses}`}
        style={{ objectPosition: "center top" }} // Adjusted content offset
        src={`${media.imageUri}`}
        alt={media.title}
      />

      {/* Details Section */}
      {!size && (
        <div className="flex flex-col justify-center p-4 leading-tight flex-grow">
          <h5 className="mb-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white break-words">
            {media.title}
          </h5>
          <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
            ({media.year}) | {media.genre}
          </p>
          <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
            Rating: {media.rating}
          </p>
        </div>
      )}
    </Link>
  );
}
