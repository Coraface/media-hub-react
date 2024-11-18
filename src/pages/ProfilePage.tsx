import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useKeycloakAuth from "../hooks/useKeycloakAuth";

interface Media {
  id: number;
  title: string;
  type: "movie" | "series";
}

interface UserProfile {
  username: string;
  email: string;
  avatarUrl: string;
}

const ProfilePage = () => {
  const { keycloak, initialized } = useKeycloakAuth();
  console.log("Keycloak", keycloak);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [wantedMedia, setWantedMedia] = useState<Media[]>([]);
  const [finishedMedia, setFinishedMedia] = useState<Media[]>([]);

  useEffect(() => {
    // Fetch user profile info (could come from an API or context)
    const fetchUserProfile = async () => {
      // Example data
      const profileData: UserProfile = {
        username: keycloak.tokenParsed?.preferred_username || "John Doe",
        email: keycloak.tokenParsed?.email,
        avatarUrl: "https://via.placeholder.com/150",
      };
      setUserProfile(profileData);

      // Example media data
      const wanted: Media[] = [
        { id: 1, title: "The Matrix", type: "movie" },
        { id: 2, title: "Breaking Bad", type: "series" },
      ];
      const finished: Media[] = [
        { id: 3, title: "Inception", type: "movie" },
        { id: 4, title: "Stranger Things", type: "series" },
      ];

      setWantedMedia(wanted);
      setFinishedMedia(finished);
    };

    fetchUserProfile();
  }, [
    keycloak.tokenParsed?.preferred_username,
    keycloak.tokenParsed?.email,
    keycloak.tokenParsed?.name,
    initialized,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* User Info Header */}
        <div className="flex items-center space-x-4">
          <img
            src={userProfile?.avatarUrl}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {userProfile?.username}
            </h1>
            <p className="text-gray-600">{userProfile?.email}</p>
          </div>
        </div>

        {/* Media Sections */}
        <div className="mt-8">
          {/* Wanted Media */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Wanted Media
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {wantedMedia.length > 0 ? (
                wantedMedia.map((media) => (
                  <div
                    key={media.id}
                    className="bg-gray-200 p-4 rounded-lg shadow-sm"
                  >
                    <h3 className="font-semibold text-gray-700">
                      {media.title}
                    </h3>
                    <p className="text-gray-500">
                      {media.type === "movie" ? "Movie" : "Series"}
                    </p>
                  </div>
                ))
              ) : (
                <p>No wanted media available.</p>
              )}
            </div>
          </section>

          {/* Finished Media */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Finished Media
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {finishedMedia.length > 0 ? (
                finishedMedia.map((media) => (
                  <div
                    key={media.id}
                    className="bg-gray-200 p-4 rounded-lg shadow-sm"
                  >
                    <h3 className="font-semibold text-gray-700">
                      {media.title}
                    </h3>
                    <p className="text-gray-500">
                      {media.type === "movie" ? "Movie" : "Series"}
                    </p>
                  </div>
                ))
              ) : (
                <p>No finished media available.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
