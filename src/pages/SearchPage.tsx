import { useSearchMediaQuery } from "../store";
import MediaCard from "../components/MediaCard";

const getQueryParam = (param: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  const term = urlParams.get(param);

  if (!term) {
    throw new Error(`No search term found`);
  }
  return term;
};

export default function SearchPage() {
  const term = getQueryParam("term");
  const { data, error, isLoading } = useSearchMediaQuery(term);
  console.log(data, error, isLoading);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading media</div>;
  const renderedMedia = data?.map((media) => {
    return <MediaCard key={media.id} media={media} />;
  });
  return (
    <div className="flex flex-wrap gap-4 justify-center p-4">
      {renderedMedia}
    </div>
  );
}
