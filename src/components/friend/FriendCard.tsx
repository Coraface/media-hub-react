import { Link } from "react-router-dom";
import { User } from "../../api/types/user";

export default function FriendCard({ friend }: { friend: User }) {
  return (
    <Link
      to={`/profile/${friend.userName}`}
      className="flex items-center bg-white border border-gray-200 rounded-full shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 w-full max-w-xl overflow-hidden"
    >
      {/* Friend Profile Image */}
      <img
        className="flex-shrink-0 object-cover w-16 h-16 rounded-full transition-opacity duration-300 hover:opacity-70"
        src={friend.photoUri}
        alt={friend.userName}
      />

      {/* Details Section */}
      <div className="flex flex-col justify-center p-4 leading-tight flex-grow">
        <h5 className="mb-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
          {friend.fullName}
        </h5>
        {/* <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
          Mutual Friends: {friend.mutualFriends}
        </p> */}
      </div>
    </Link>
  );
}
