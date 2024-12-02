import Button from "./Button";

interface AcceptFriendRequestProps {
  friendRequestActionResults: { isLoading: boolean };
  requester: string;
  handleFriendRequest: (requester: string, isAccept: string) => void;
}

export default function AcceptFriendRequest({
  friendRequestActionResults,
  requester,
  handleFriendRequest,
}: AcceptFriendRequestProps) {
  return (
    <Button
      loading={friendRequestActionResults?.isLoading}
      onClick={() => handleFriendRequest(requester, "accepted")}
      className="remove text-white py-1 px-3 rounded hover:bg-green-600"
    >
      Accept
    </Button>
  );
}
