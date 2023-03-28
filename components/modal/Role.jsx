import { useState, useEffect, useCallback } from "react";
import { IconUserCircle } from "@tabler/icons-react";

import { supabase } from "@/utils/SupabaseClient";

const RoleSelector = ({ character, onApply, onClose }) => {
  return (
    <div className="flex justify-between items-center pb-10">
      <div className="flex items-center gap-1">
        <IconUserCircle />
        <h4 className="text-2xl">{character.name}</h4>
      </div>
      <button
        type="button"
        className="text-white bg-slate-600 hover:bg-slate-1100 rounded-xl text-sm px-10 py-2 text-center"
        onClick={() => {
          onApply(character.prompt);
          onClose();
        }}
      >
        Apply
      </button>
    </div>
  );
};

export default function Role({ onClose, onApply }) {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    getCharacterList();
  }, []);

  const getCharacterList = async () => {
    try {
      setLoading(true);
      const {
        data: items,
        error,
        status,
      } = await supabase.from("chatgpt_prompt").select(`*`);
      if (error && status !== 406) {
        throw error;
      }

      if (items) {
        setCharacters(items);
        setFilteredCharacters(items);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback((searchText) => {
    setSearchValue(searchText);
    setFilteredCharacters(() => {
      if (searchText) {
        return characters.filter((character) => character.name.includes(searchText));
      } else {
        return characters;
      }
    })
  }, [characters])

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <span className="text-xl">Select a Character</span>
        <div className="relative">
          <div class="flex items-center pt-0 pr-0 pb-0 pl-3 absolute inset-y-0 left-0 pointer-events-none">
            <p>
              <svg
                class="w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewbox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21
                21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </p>
          </div>
          <input
            placeholder="Search positions"
            type="search"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-10 border border-zinc-500 rounded-lg focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>
      </div>
      <div className="mt-10">
        {filteredCharacters.map((character) => (
          <RoleSelector
            character={character}
            onApply={onApply}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}
