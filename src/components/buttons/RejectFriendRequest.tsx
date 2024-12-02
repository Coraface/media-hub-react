import Button from "./Button";

interface RejectFriendRequestProps {
  friendRequestActionResults: { isLoading: boolean };
  requester: string;
  handleFriendRequest: (requester: string, isAccept: string) => void;
}

export default function RejectFriendRequest({
  friendRequestActionResults,
  requester,
  handleFriendRequest,
}: RejectFriendRequestProps) {
  return (
    <Button
      loading={friendRequestActionResults?.isLoading}
      onClick={() => handleFriendRequest(requester, "rejected")}
      className="remove text-white py-1 px-3 rounded hover:bg-red-600"
    >
      Reject
    </Button>
  );
}
