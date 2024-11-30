import Section from "../Section";
import MediaCard from "./MediaCard";

import { Media } from "../../api/types/media";

export default function MediaSection({
  wantedMovies,
  finishedMovies,
  wantedSeries,
  finishedSeries,
}: {
  wantedMovies: Media[];
  finishedMovies: Media[];
  wantedSeries: Media[];
  finishedSeries: Media[];
}) {
  return (
    <>
      <Section
        title="Wanted Movies"
        data={wantedMovies}
        placeholderText="No wanted movies found."
        renderItem={(item, index) => {
          const keyPrefix = "wanted-movies";
          return (
            <MediaCard
              key={
                item.id ? `${item.id}-${keyPrefix}` : `${keyPrefix}-${index}`
              }
              media={{ ...item, media_type: "movie" }}
              size="small"
            />
          );
        }}
      />
      <Section
        title="Finished Movies"
        data={finishedMovies}
        placeholderText="No finished movies available."
        renderItem={(item, index) => {
          const keyPrefix = "finished-movies";
          return (
            <MediaCard
              key={
                item.id ? `${item.id}-${keyPrefix}` : `${keyPrefix}-${index}`
              }
              media={{ ...item, media_type: "movie" }}
              size="small"
            />
          );
        }}
      />

      {/* Series */}
      <Section
        title="Wanted Series"
        data={wantedSeries}
        placeholderText="No wanted series available."
        renderItem={(item, index) => {
          const keyPrefix = "wanted-series";
          return (
            <MediaCard
              key={
                item.id ? `${item.id}-${keyPrefix}` : `${keyPrefix}-${index}`
              }
              media={{ ...item, media_type: "tv" }}
              size="small"
            />
          );
        }}
      />
      <Section
        title="Finished Series"
        data={finishedSeries}
        placeholderText="No finished series available."
        renderItem={(item, index) => {
          const keyPrefix = "finished-series";
          return (
            <MediaCard
              key={
                item.id ? `${item.id}-${keyPrefix}` : `${keyPrefix}-${index}`
              }
              media={{ ...item, media_type: "tv" }}
              size="small"
            />
          );
        }}
      />
    </>
  );
}
