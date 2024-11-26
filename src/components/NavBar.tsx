import { Link, useNavigate } from "react-router-dom";
import SearchInput from "./SearchBar";
import useKeycloakAuth from "../hooks/useKeycloakAuth";
import Button from "./Button";
import { MediaSearchBar } from "./media/MediaSearchBar";

export default function NavBar() {
  const { keycloak } = useKeycloakAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${keycloak?.tokenParsed?.preferred_username}`);
  };

  return (
    <div className="flex items-center justify-between px-4 py-10 border-b h-14">
      {/* Logo aligned to the left */}
      <div className="flex items-center space-x-2 text-sm">
        <Link to="/" className="text-lg font-bold">
          MediaHub
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-grow flex justify-center">
        <div className="w-80 max-w-lg">
          <MediaSearchBar />
        </div>
      </div>

      {/* Profile */}
      <Button
        loading={false}
        onClick={handleProfileClick}
        className="flex items-center justify-center space-x-2 w-12 h-12 border border-white rounded-full text-white text-md transition-shadow bg-transparent duration-300 hover:shadow-[0_0_0_3px_#fff]"
      >
        <span className="text-sm">
          {keycloak?.tokenParsed?.preferred_username.slice(0, 1).toUpperCase()}
        </span>
      </Button>
    </div>
  );
}
