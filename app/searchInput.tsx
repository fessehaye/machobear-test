import { useEffect, useState } from "react";
import TextSearchResults from "./textSearchResults";
import { useLocation } from "@remix-run/react";
import { useDebounce } from "@uidotdev/usehooks";
import { DataResult } from "./types";

const querySearch = async (searchText: string): Promise<DataResult | null> => {
  const url = new URL("/search", window.location.origin);
  url.searchParams.append("q", searchText);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data as DataResult;
  } catch (error) {
    console.error("Search request failed", error);
    return null;
  }
};

export default function SearchInput() {
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 300);
  const { pathname } = useLocation();
  const [results, setResults] = useState<DataResult | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (debouncedText) {
        const data = await querySearch(debouncedText);
        setResults(data);
      } else {
        setResults(null);
      }
    }
    fetchData();
  }, [debouncedText]);

  useEffect(() => {
    setText("");
    return () => {
      setText("");
    };
  }, [pathname]);

  return (
    <div className="w-full max-w-[800px] flex flex-col mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full p-[18px] ps-10 pe-10 text-base leading-none placeholder:text-[#686868] text-black border border-gray-300 rounded-lg bg-gray-50 "
          placeholder="Search by Artist or Album"
          data-testid="search-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <TextSearchResults results={results} />
        {text.length > 0 ? (
          <button
            className="absolute end-2.5 inset-y-0"
            data-testid="clear-input"
            onClick={() => setText("")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
