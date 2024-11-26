import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar";

export const FriendSearchBar = () => {
  const navigate = useNavigate();

  const handleFriendSearch = (term: string) => {
    navigate(`/search/friends?term=${term}`);
  };

  return (
    <SearchBar
      placeholder="Search for friends..."
      onSearch={handleFriendSearch}
      storageKey="friendSearchHistory"
      maxHistory={10}
    />
  );
};
