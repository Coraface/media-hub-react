import { Link, useNavigate } from "react-router-dom";
import useKeycloakAuth from "../hooks/useKeycloakAuth";
import Button from "./buttons/Button";
import { MediaSearchBar } from "./media/MediaSearchBar";
import { useEffect, useRef, useState } from "react";
import GenericDropdown from "./GenericDropdown";

export default function NavBar() {
  const { keycloak } = useKeycloakAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await keycloak.logout();
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const options = [
    {
      label: "Profile",
      onClick: () =>
        navigateTo(`/profile/${keycloak.tokenParsed?.preferred_username}`),
    },
    { label: "Logout", onClick: handleLogout },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log(dropdownRef.current, buttonRef.current);
  return (
    <div className="flex flex-wrap items-center justify-between px-4 py-10 border-b gap-4">
      {/* Logo aligned to the left */}
      <div className="text-sm">
        <Link to="/" className="text-lg font-bold">
          MediaHub
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <div className="max-w-lg">
          <MediaSearchBar />
        </div>
      </div>

      {/* Profile */}
      <div className="relative">
        <Button
          ref={buttonRef}
          loading={false}
          onClick={handleProfileClick}
          className="flex items-center justify-center space-x-2 w-12 h-12 border border-white rounded-full text-white text-md transition-shadow bg-transparent duration-300 hover:shadow-[0_0_0_3px_#fff]"
        >
          <span className="text-sm">
            {keycloak?.tokenParsed?.preferred_username
              .slice(0, 1)
              .toUpperCase()}
          </span>
        </Button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <GenericDropdown
            ref={dropdownRef}
            options={options}
            classNames="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10"
          />
        )}
      </div>
    </div>
  );
}
