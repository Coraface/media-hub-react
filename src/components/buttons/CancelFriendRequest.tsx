import Button from "./Button";

interface CancelFriendRequestProps {
  friendRequestActionResults: { isLoading: boolean };
  requester: string;
  handleFriendRequest: (requester: string, isAccept: string) => void;
}

export default function CancelFriendRequest({
  friendRequestActionResults,
  requester,
  handleFriendRequest,
}: CancelFriendRequestProps) {
  return (
    <Button
      loading={friendRequestActionResults?.isLoading}
      onClick={() => handleFriendRequest(requester, "canceled")}
      className="remove text-white py-1 px-3 rounded hover:bg-red-600"
    >
      Cancel Request
    </Button>
  );
}
