import { CgUserRemove } from "react-icons/cg";
import Button from "./Button";

interface RemoveFriendButtonProps {
  sendFriendRequestResults: { isLoading: boolean };
  handleRemoveFriend: () => void;
  isRequestSent: boolean;
  isFriend: boolean;
}

export default function RemoveFriendButton({
  sendFriendRequestResults,
  handleRemoveFriend,
  isRequestSent,
  isFriend,
}: RemoveFriendButtonProps) {
  return (
    <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
      <Button
        loading={sendFriendRequestResults?.isLoading}
        onClick={handleRemoveFriend}
        disabled={isRequestSent || isFriend}
        className="bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition"
      >
        {isFriend && (
          <>
            <CgUserRemove className="mr-2" />
            Remove Friend
          </>
        )}
      </Button>
    </div>
  );
}
