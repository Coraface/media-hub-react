import { CgUserAdd } from "react-icons/cg";
import Button from "./Button";

interface AddFriendButtonProps {
  sendFriendRequestResults: { isLoading: boolean };
  handleSendRequest: () => void;
}

export default function AddFriendButton({
  sendFriendRequestResults,
  handleSendRequest,
}: AddFriendButtonProps) {
  return (
    <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
      <Button
        loading={sendFriendRequestResults?.isLoading}
        onClick={handleSendRequest}
        disabled={sendFriendRequestResults?.isLoading}
        className="bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition"
      >
        <CgUserAdd className="mr-2" />
        Add Friend
      </Button>
    </div>
  );
}
