import { useSearchMediaQuery } from "../store";
import MediaCard from "../components/MediaCard";

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const location = useLocation();
  const [term, setTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get("term");
    if (term) {
      setTerm(term);
      console.log("Search term:", term);
    }
  }, [location.search]);

  const { data, error, isLoading } = useSearchMediaQuery(term, {
    skip: !term,
  });
  console.log(data, error, isLoading);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading media</div>;

  const renderedMedia = data
    ?.filter((media) => media.imageUri)
    ?.sort((a, b) => b.popularity - a.popularity)
    ?.map((media) => {
      return <MediaCard key={media.id} media={media} />;
    });

  return (
    <div className="flex flex-wrap gap-4 justify-center p-4">
      {renderedMedia}
    </div>
  );
}
