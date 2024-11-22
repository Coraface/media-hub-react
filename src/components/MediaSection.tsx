import { Media } from "../api/types/media";
import MediaCard from "./MediaCard";

interface MediaSectionProps {
  title: string;
  mediaData: Media[];
  placeholderText: string;
  keyPrefix: string;
  media_type: string;
}

const MediaSection: React.FC<MediaSectionProps> = ({
  title,
  mediaData,
  placeholderText,
  keyPrefix,
  media_type,
}) => (
  <section>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="flex flex-row gap-6">
      {mediaData?.length > 0 ? (
        mediaData.slice(0, 5).map((media, index) => {
          const mediaWithType = { ...media, media_type };
          return (
            <MediaCard
              key={
                media.id ? `${media.id}-${keyPrefix}` : `${keyPrefix}-${index}`
              }
              media={mediaWithType}
              size="small"
            />
          );
        })
      ) : (
        <p className="col-span-full text-gray-600">{placeholderText}</p>
      )}
    </div>
  </section>
);

export default MediaSection;
