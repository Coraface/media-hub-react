import AcceptFriendRequest from "./AcceptFriendRequest";
import RejectFriendRequest from "./RejectFriendRequest";

interface AcceptRejectFlexProps {
  friendRequestActionResults: { isLoading: boolean };
  requester: string;
  handleFriendRequest: (requester: string, isAccept: string) => void;
}

export default function AcceptRejectFlex({
  friendRequestActionResults,
  requester,
  handleFriendRequest,
}: AcceptRejectFlexProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AcceptFriendRequest
        friendRequestActionResults={friendRequestActionResults}
        handleFriendRequest={handleFriendRequest}
        requester={requester}
      />
      <RejectFriendRequest
        friendRequestActionResults={friendRequestActionResults}
        handleFriendRequest={handleFriendRequest}
        requester={requester}
      />
    </div>
  );
}
