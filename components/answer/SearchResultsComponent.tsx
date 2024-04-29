// 1. Import the 'useState' and 'useEffect' hooks from React
import { useState, useEffect } from "react";
import { IconPlus, IconClose } from "@/components/ui/icons";

// 2. Define the 'SearchResult' interface with properties for 'favicon', 'link', and 'title'
interface SearchResult {
  // favicon: string;
  // link: string;
  // title: string;
  title: string;
  doi: string;
  date?: string;
  pId: string;
  id: string;
  paragraph: string;
}

// 3. Define the 'SearchResultsComponentProps' interface with a 'searchResults' property of type 'SearchResult[]'
export interface SearchResultsComponentProps {
  searchResults: SearchResult[];
}

// 4. Define the 'SearchResultsComponent' functional component that takes 'searchResults' as a prop
const SearchResultsComponent = ({
  searchResults,
}: {
  searchResults: SearchResult[];
}) => {
  // 5. Use the 'useState' hook to manage the 'isExpanded' and 'loadedFavicons' state
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedFavicons, setLoadedFavicons] = useState<boolean[]>([]);

  // 6. Use the 'useEffect' hook to initialize the 'loadedFavicons' state based on the 'searchResults' length
  useEffect(() => {
    setLoadedFavicons(Array(searchResults.length).fill(false));
  }, [searchResults]);

  // 7. Define the 'toggleExpansion' function to toggle the 'isExpanded' state
  const toggleExpansion = () => setIsExpanded(!isExpanded);

  // 8. Define the 'visibleResults' variable to hold the search results to be displayed based on the 'isExpanded' state
  const visibleResults = isExpanded ? searchResults : searchResults.slice(0, 3);
  console.log(searchResults);

  // 9. Define the 'handleFaviconLoad' function to update the 'loadedFavicons' state when a favicon is loaded
  const handleFaviconLoad = (index: number) => {
    setLoadedFavicons((prevLoadedFavicons) => {
      const updatedLoadedFavicons = [...prevLoadedFavicons];
      updatedLoadedFavicons[index] = true;
      return updatedLoadedFavicons;
    });
  };
  const [showMore, setShowMore] = useState(false);

  // 10. Define the 'SearchResultsSkeleton' component to render a loading skeleton
  const SearchResultsSkeleton = () => (
    <>
      {Array.from({ length: showMore ? searchResults.length : 3 }).map(
        (_, index) => (
          <div
            key={`skeleton-${index}`}
            className="p-2 w-full sm:w-1/2 md:w-1/4"
          >
            <div className="flex items-center space-x-2 dark:bg-slate-700 bg-gray-100 p-3 rounded-lg h-full">
              <div className="w-5 h-5 dark:bg-slate-600 bg-gray-400 rounded animate-pulse"></div>
              <div className="w-full h-4 dark:bg-slate-600 bg-gray-400 rounded animate-pulse"></div>
            </div>
          </div>
        )
      )}
    </>
  );
  // 11. Render the 'SearchResultsComponent'
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mt-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold flex-grow text-black dark:text-white">
          Sources
        </h2>
        {searchResults.length > 3 && (
          <div className="flex justify-center ml-2">
            <button
              className="text-black dark:text-white focus:outline-none"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? <IconClose /> : <IconPlus />}
            </button>
          </div>
        )}
      </div>
      <div className="mx-1 transition-all duration-500">
        {searchResults.length === 0 ? (
          <SearchResultsSkeleton />
        ) : (
          searchResults
            .slice(0, showMore ? searchResults.length : 3)
            .map((result, index) => (
              <div key={`searchResult-${index}`} className="p-2 w-full">
                <div className="flex items-center space-x-2 dark:bg-slate-700 bg-gray-100 p-3 rounded-lg h-full">
                  <a
                    href={result.doi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold truncate dark:text-gray-200 dark:hover:text-white text-gray-700 hover:text-black"
                  >
                    {result.title}
                  </a>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default SearchResultsComponent;
