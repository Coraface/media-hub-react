import React, { useEffect, useState } from "react";
import { useFetchFriendshipsQuery } from "../../store";
import { skipToken } from "@reduxjs/toolkit/query";
import Section from "../Section";
import FriendCard from "./FriendCard";

interface FriendsListProps {
  username: string | undefined;
}

const FriendsList: React.FC<FriendsListProps> = ({ username }) => {
  const [user, setUsername] = useState<string | undefined>(username);

  useEffect(() => {
    setUsername(username);
  }, [username]);

  const {
    data: friends,
    isLoading: isLoadingFriends,
    error: errorFriends,
  } = useFetchFriendshipsQuery(user ? user : skipToken);

  return (
    <>
      {friends && (
        <div>
          <Section
            title="Friends"
            data={friends}
            placeholderText="No friends found."
            renderItem={(item) => (
              <FriendCard key={item.userName} friend={item} size="small" />
            )}
          />
        </div>
      )}
    </>
  );
};

export default FriendsList;
