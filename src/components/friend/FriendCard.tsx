import { Link } from "react-router-dom";
import { User } from "../../api/types/user";

interface FriendCardProps {
  friend?: User;
  size?: "small" | "regular"; // Control the size of the card
}

export default function FriendCard({ friend, size }: FriendCardProps) {
  const linkClasses = size ? "w-16 h-16 md:w-16 md:h-16" : "w-full";
  const imgClasses = size
    ? "w-16 h-16 md:w-16 md:h-16"
    : "w-36 h-36 md:w-40 md:h-40";
  return (
    <>
      {friend && (
        <Link
          to={`/profile/${friend.userName}`}
          className={`flex items-center bg-white border border-gray-200 rounded-full shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 max-w-xl ${linkClasses}`}
        >
          {/* Friend Profile Image */}
          <img
            className={`flex-shrink-0 object-cover rounded-full transition-opacity duration-300 hover:opacity-70 ${imgClasses}`}
            src={friend.photoUri}
            alt={friend.userName}
          />

          {/* Details Section */}
          {!size && (
            <div className="flex flex-col flex-wrap justify-center p-4 leading-tight flex-grow">
              <h5 className="mb-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                {friend.userName}
              </h5>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                {friend.fullName}
              </p>
            </div>
          )}
        </Link>
      )}
    </>
  );
}
