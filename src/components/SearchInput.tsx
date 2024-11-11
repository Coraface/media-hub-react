import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VscSearch } from "react-icons/vsc";

export default function SearchInput() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/search?term=${term}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <input
          className="pr-10 pl-4 py-2 w-full border rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search"
          autoComplete="on"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <VscSearch className="h-5 w-5 text-gray-500" />
        </div>
      </div>
    </form>
  );
}
