import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar";

export const MediaSearchBar = () => {
  const navigate = useNavigate();

  const handleMediaSearch = (term: string) => {
    navigate(`/search/media?term=${term}`);
  };

  return (
    <SearchBar
      placeholder="Search for media..."
      onSearch={handleMediaSearch}
      storageKey="mediaSearchHistory"
    />
  );
};
