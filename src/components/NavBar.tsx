import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";
import useKeycloakAuth from "../hooks/useKeycloakAuth";

export default function NavBar() {
  useKeycloakAuth();

  return (
    <div className="flex items-center justify-between px-4 border-b h-14">
      {/* Logo aligned to the left */}
      <div className="flex items-center space-x-2 text-sm">
        <Link to="/" className="text-lg font-bold">
          MediaHub
        </Link>
      </div>

      {/* Centered Search Bar */}
      <div className="flex-grow flex justify-center">
        <div className="w-80 max-w-lg">
          <SearchInput />
        </div>
      </div>
    </div>
  );
}
