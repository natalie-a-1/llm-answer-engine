// 1. Import the 'useState' and 'useEffect' hooks from React
import { useState, useEffect } from "react";
import { IconPlus, IconClose, IconCopy } from "@/components/ui/icons";
import { Copy } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// 2. Define the 'SearchResult' interface with properties for 'favicon', 'link', and 'title'
interface SearchResult {
  title: string;
  doi?: string;
  citation: string;
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
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!showMore && selectedSources.length) {
      setSelectedSources([]); // Optionally clear selection when collapsed
    }
  }, [showMore, selectedSources.length]);

  const handleSourceToggle = (id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id)
        ? prev.filter((sourceId) => sourceId !== id)
        : [...prev, id]
    );
  };

  const exportSelectedSources = () => {
    console.log("Attempting to export sources for IDs:", selectedSources);
  
    const selectedCitations = searchResults
      .filter(source => selectedSources.includes(source.id))
      .map(source => source.citation)
      .join("\n");
  
    console.log("Selected Citations: ", selectedCitations);
  
    navigator.clipboard.writeText(selectedCitations)
      .then(() => {
        console.log("Citations successfully copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy citations to clipboard:", err);
      });
  };
  

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
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mt-4 w-full">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold flex-grow text-black dark:text-white">
          Sources
        </h2>
        <IconPlus
          className="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400"
          onClick={() => setShowMore(true)}
        />
      </div>
      <div
        className={`flex flex-wrap mx-1 transition-all duration-500 max-h-[500px] overflow-hidden`}
      >
        {searchResults.length === 0 ? (
          <SearchResultsSkeleton />
        ) : (
          searchResults
            .slice(0, showMore ? searchResults.length : 5)
            .map((result) => (
              <div
                key={result.id}
                className="transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-200 cursor-pointer p-2 w-full"
              >
                <div className="flex items-center space-x-2 dark:bg-slate-700 bg-gray-100 p-3 rounded-lg h-full overflow-hidden">
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

        {showMore && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black opacity-80"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="fixed inset-0 bg-black opacity-10 transition-opacity"
                onClick={() => setShowMore(false)}
              ></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-auto overflow-hidden relative">
                <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold flex-grow text-black dark:text-white pl-4">
                    Sources
                  </h2>
                  {selectedSources.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="link"
                          onClick={exportSelectedSources}
                        >
                          <Copy
                            width="20"
                            height="20"
                            className="absolute right-[4rem] w-6 h-6 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy citations</TooltipContent>
                    </Tooltip>
                  )}
                  <IconClose
                    className="w-6 h-6 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-150 ease-in-out"
                    onClick={() => setShowMore(false)}
                  />
                </div>
                <div className="overflow-y-auto p-6 space-y-6 max-h-[70vh]">
                  {searchResults.map((item) => (
                    <div key={item.id} className="flex items-center space-x-6">
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(item.id)}
                        onChange={() => handleSourceToggle(item.id)}
                        className="form-checkbox h-5 w-5 text-blue-600 mr-4"
                      />
                      <div className="flex-grow">
                        <a
                          href={item.doi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-xl mb-2 hover:underline text-gray-900 dark:text-gray-100"
                        >
                          {item.title}
                        </a>
                        <p className="text-gray-500 dark:text-gray-400 text-base mb-2">
                          {item.date}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                          {item.paragraph.length > 200
                            ? `${item.paragraph.substring(0, 200)}...`
                            : item.paragraph}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsComponent;
