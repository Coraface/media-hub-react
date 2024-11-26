import { useSearchMediaQuery, useFetchUserQuery } from "../store"; // Import both queries
import MediaCard from "../components/media/MediaCard";
import FriendCard from "../components/friend/FriendCard"; // New component for friends
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

export default function SearchPage() {
  const location = useLocation();
  const [term, setTerm] = useState("");
  const [type, setType] = useState<"media" | "friends">("media");

  const getSearchType = useCallback(
    (param: string): string | undefined => {
      // Extract value from the path, assuming format like /profile/username
      const pathSegments = location.pathname.split("/").filter(Boolean); // Split and remove empty parts
      const paramIndex = pathSegments.indexOf(param);
      if (paramIndex !== -1 && paramIndex + 1 < pathSegments.length) {
        return pathSegments[paramIndex + 1];
      }
      throw new Error(`Value for "${param}" not found in the path.`);
    },
    [location.pathname]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get("term");
    const type = getSearchType("search") as "media" | "friends";
    if (term) setTerm(term);
    if (type) setType(type); // Default to "media" if not provided
  }, [getSearchType, location.search]);

  // Fetch data based on type
  const {
    data: mediaData,
    error: mediaError,
    isLoading: mediaLoading,
  } = useSearchMediaQuery(term, {
    skip: !term || type !== "media",
  });

  const {
    data: friendsData,
    error: friendsError,
    isLoading: friendsLoading,
  } = useFetchUserQuery(term, {
    skip: !term || type !== "friends",
  });

  // Loading and error states
  if (type === "media" && mediaLoading) return <div>Loading media...</div>;
  if (type === "friends" && friendsLoading)
    return <div>Loading friends...</div>;

  if (type === "media" && mediaError) return <div>Error loading media</div>;
  if (type === "friends" && friendsError)
    return <div>Error loading friends</div>;

  // Render media or friends
  const renderedItems =
    type === "media" ? (
      mediaData
        ?.filter((media) => media.imageUri)
        ?.sort((a, b) => b.popularity - a.popularity)
        ?.map((media) => <MediaCard key={media.id} media={media} />)
    ) : friendsData ? (
      <FriendCard key={friendsData.userName} friend={friendsData} />
    ) : null;

  return (
    <div className="flex flex-wrap gap-4 justify-center p-4">
      {renderedItems}
    </div>
  );
}
