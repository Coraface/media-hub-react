import { CgUserAdd } from "react-icons/cg";
import Button from "./Button";

interface AddFriendButtonProps {
  sendFriendRequestResults: { isLoading: boolean };
  handleSendRequest: () => void;
  isRequestSent: boolean;
  isFriend: boolean;
}

export default function AddFriendButton({
  sendFriendRequestResults,
  handleSendRequest,
  isRequestSent,
  isFriend,
}: AddFriendButtonProps) {
  return (
    <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
      <Button
        loading={sendFriendRequestResults?.isLoading}
        onClick={handleSendRequest}
        disabled={isRequestSent || isFriend}
        className="bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition"
      >
        {isFriend ? (
          <>
            <CgUserAdd className="mr-2" />
            Add Friend
          </>
        ) : isRequestSent ? (
          "Request Sent"
        ) : (
          "+ Add Friend"
        )}
      </Button>
    </div>
  );
}
