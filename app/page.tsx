"use client";
// 1. Import Dependencies
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
  use,
} from "react";
import { useActions, readStreamableValue } from "ai/rsc";
import { type AI } from "./action";
import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import Textarea from "react-textarea-autosize";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
// Main components
import SearchResultsComponent from "@/components/answer/SearchResultsComponent";
import UserMessageComponent from "@/components/answer/UserMessageComponent";
import FollowUpComponent from "@/components/answer/FollowUpComponent";
import InitialQueries from "@/components/answer/InitialQueries";
// Sidebar components
import LLMResponseComponent from "@/components/answer/LLMResponseComponent";
import ImagesComponent from "@/components/answer/ImagesComponent";
import TablesComponent from "@/components/answer/TablesComponent";
import {
  ArrowUp,
  XCircle,
  UploadSimple,
  Pulse,
  FilePlus,
} from "@phosphor-icons/react";
// OPTIONAL: Use Upstash rate limiting to limit the number of requests per user
import RateLimit from "@/components/answer/RateLimit";
// For uploading images to llm
import imageCompression from "browser-image-compression";

// UNINCLUDED: Function calling components
// import VideosComponent from "@/components/answer/VideosComponent";
// Function calling components
// const MapComponent = dynamic(() => import("@/components/answer/Map"), {
//   ssr: false,
// });
// import MapDetails from "@/components/answer/MapDetails";
// import ShoppingComponent from "@/components/answer/ShoppingComponent";
// import FinancialChart from "@/components/answer/FinancialChart";

// interface Video {
//   link: string;
//   imageUrl: string;
// }
// interface Place {
//   cid: React.Key | null | undefined;
//   latitude: number;
//   longitude: number;
//   title: string;
//   address: string;
//   rating: number;
//   category: string;
//   phoneNumber?: string;
//   website?: string;
// }
// interface Shopping {
//   type: string;
//   title: string;
//   source: string;
//   link: string;
//   price: string;
//   shopping: any;
//   position: number;
//   delivery: string;
//   imageUrl: string;
//   rating: number;
//   ratingCount: number;
//   offers: string;
//   productId: string;
// }

// 2. Set up types
interface SearchResult {
  title: string;
  doi?: string;
  citation: string;
  date?: string;
  pId: string;
  id: string;
  paragraph: string;
}
interface Message {
  id: number;
  type: string;
  content: string;
  userMessage: string;
  images: Image[];
  tables: Table[];
  // videos: Video[];
  followUp: FollowUp | null;
  isStreaming: boolean;
  searchResults?: SearchResult[];
  conditionalFunctionCallUI?: any;
  status?: string;
  // places?: Place[];
  // shopping?: Shopping[];
  ticker?: string | undefined;
}
interface StreamMessage {
  searchResults?: any;
  userMessage?: string;
  llmResponse?: string;
  llmResponseEnd?: boolean;
  images?: any;
  tables?: any;
  videos?: any;
  followUp?: any;
  conditionalFunctionCallUI?: any;
  status?: string;
  // places?: Place[];
  // shopping?: Shopping[];
  ticker?: string;
}
interface Image {
  doi: string;
  explanation: string;
  link: string;
}
interface Table {
  doi: string;
  explanation: string;
  link: string;
}
interface FollowUp {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export default function Page() {
  // 3. Set up action that will be used to stream all the messages
  const { myAction } = useActions<typeof AI>();
  // 4. Set up form submission handling
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState("");
  // 5. Set up state for the messages
  const [messages, setMessages] = useState<Message[]>([]);
  // 6. Set up state for the CURRENT LLM response (for displaying in the UI while streaming)
  const [currentLlmResponse, setCurrentLlmResponse] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleFilesChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = Array.from(event.target.files || []).slice(0, 5);
    const compressedFiles: File[] = [];
    const fileNames: string[] = [];
    const newImagePreviews: string[] = [];

    for (const file of fileList) {
      if (["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        };
        try {
          const compressedFile = await imageCompression(file, options);
          compressedFiles.push(compressedFile);
          fileNames.push(compressedFile.name + " (compressed)");
          newImagePreviews.push(URL.createObjectURL(compressedFile));
        } catch (error) {
          console.error("Compression Error:", error);
        }
      } else {
        compressedFiles.push(file);
        fileNames.push(file.name);
        newImagePreviews.push(URL.createObjectURL(file));
      }
    }

    setFiles(compressedFiles);
    setImagePreviews(newImagePreviews);
  };

  const removeImagePreview = (index: number) => {
    const filteredFiles = files.filter((_, idx) => idx !== index);
    const filteredPreviews = imagePreviews.filter((_, idx) => idx !== index);
    setFiles(filteredFiles);
    setImagePreviews(filteredPreviews);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 7. Set up handler for when the user clicks on the follow up button
  const handleFollowUpClick = useCallback(async (question: string) => {
    setCurrentLlmResponse("");
    await handleUserMessageSubmission(question);
  }, []);
  // 8. For the form submission, we need to set up a handler that will be called when the user submits the form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        if (
          e.target &&
          ["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);
  // 9. Set up handler for when a submission is made, which will call the myAction function
  const handleSubmit = async (message: string) => {
    if (!message) return;
    await handleUserMessageSubmission(message);
  };
  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const messageToSend = inputValue.trim();
    if (!messageToSend) return;
    setInputValue("");
    setFiles([]);
    setImagePreviews([]);
    // TODO: Implement sending logic here
    await handleSubmit(messageToSend);
  };
  const handleUserMessageSubmission = async (
    userMessage: string
  ): Promise<void> => {
    console.log("handleUserMessageSubmission", userMessage);
    const newMessageId = Date.now();
    const newMessage = {
      id: newMessageId,
      type: "userMessage",
      userMessage: userMessage,
      content: "",
      images: [],
      tables: [],
      videos: [],
      followUp: null,
      isStreaming: true,
      searchResults: [] as SearchResult[],
      // places: [] as Place[],
      // shopping: [] as Shopping[],
      status: "",
      ticker: undefined,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    let lastAppendedResponse = "";
    try {
      const streamableValue = await myAction(userMessage);
      let llmResponseString = "";
      for await (const message of readStreamableValue(streamableValue)) {
        const typedMessage = message as StreamMessage;
        setMessages((prevMessages) => {
          const messagesCopy = [...prevMessages];
          const messageIndex = messagesCopy.findIndex(
            (msg) => msg.id === newMessageId
          );
          if (messageIndex !== -1) {
            const currentMessage = messagesCopy[messageIndex];
            if (typedMessage.status === "rateLimitReached") {
              currentMessage.status = "rateLimitReached";
            }
            if (
              typedMessage.llmResponse &&
              typedMessage.llmResponse !== lastAppendedResponse
            ) {
              currentMessage.content += typedMessage.llmResponse;
              lastAppendedResponse = typedMessage.llmResponse;
            }
            if (typedMessage.llmResponseEnd) {
              currentMessage.isStreaming = false;
            }
            if (typedMessage.searchResults) {
              currentMessage.searchResults = typedMessage.searchResults;
            }
            if (typedMessage.images) {
              currentMessage.images = [...typedMessage.images];
            }
            if (typedMessage.tables) {
              currentMessage.tables = [...typedMessage.tables];
            }
            // if (typedMessage.videos) {
            //   currentMessage.videos = [...typedMessage.videos];
            // }
            if (typedMessage.followUp) {
              currentMessage.followUp = typedMessage.followUp;
            }
            // Optional Function Calling + Conditional UI
            if (typedMessage.conditionalFunctionCallUI) {
              const functionCall = typedMessage.conditionalFunctionCallUI;
              // if (functionCall.type === "places") {
              //   currentMessage.places = functionCall.places;
              // }
              // if (functionCall.type === "shopping") {
              //   currentMessage.shopping = functionCall.shopping;
              // }
              // if (functionCall.type === "ticker") {
              //   console.log("ticker", functionCall);
              //   currentMessage.ticker = functionCall.data;
              // }
            }
          }
          return messagesCopy;
        });
        if (typedMessage.llmResponse) {
          llmResponseString += typedMessage.llmResponse;
          setCurrentLlmResponse(llmResponseString);
        }
      }
    } catch (error) {
      console.error("Error streaming data for user message:", error);
    }
  };
  return (
    <div>
      {messages.length > 0 && (
        <div className="flex flex-col">
          {messages.map((message, index) => (
            <div key={`message-${index}`} className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/4 md:pr-2">
                {message.status && message.status === "rateLimitReached" && (
                  <RateLimit />
                )}
                {message.type === "userMessage" && (
                  <UserMessageComponent message={message.userMessage} />
                )}
                <LLMResponseComponent
                  llmResponse={message.content}
                  currentLlmResponse={currentLlmResponse}
                  index={index}
                  key={`llm-response-${index}`}
                />
                {message.followUp && (
                  <div className="flex flex-col">
                    <FollowUpComponent
                      key={`followUp-${index}`}
                      followUp={message.followUp}
                      handleFollowUpClick={handleFollowUpClick}
                    />
                  </div>
                )}
              </div>
              {/* Secondary content area */}
              <div className="flex flex-col w-full md:w-1/4 md:pl-2 overflow-hidden">
                {message.searchResults && (
                  <SearchResultsComponent
                    key={`searchResults-${index}`}
                    searchResults={message.searchResults}
                  />
                )}
                {message.images && (
                  <ImagesComponent
                    key={`images-${index}`}
                    images={message.images}
                  />
                )}
                {message.tables && (
                  <TablesComponent
                    key={`tables-${index}`}
                    tables={message.tables}
                  />
                )}
                {/* {message.ticker && message.ticker.length > 0 && (
                  <FinancialChart
                    key={`financialChart-${index}`}
                    ticker={message.ticker}
                  />
                )} */}
                {/* {message.searchResults && (
                  <SearchResultsComponent
                    key={`searchResults-${index}`}
                    searchResults={message.searchResults}
                  />
                )} */}
                {/* {message.places && message.places.length > 0 && (
                  <MapComponent key={`map-${index}`} places={message.places} />
                )} */}
                {/* {message.videos && (
                  <VideosComponent
                    key={`videos-${index}`}
                    videos={message.videos}
                  />
                )} */}
                {/* {message.shopping && message.shopping.length > 0 && (
                  <ShoppingComponent
                    key={`shopping-${index}`}
                    shopping={message.shopping}
                  />
                )}
                {message.places && message.places.length > 0 && (
                  <MapDetails key={`map-${index}`} places={message.places} />
                )} */}
              </div>
            </div>
          ))}
        </div>
      )}
      <div
        className={`px-2 fixed inset-x-0 bottom-0 w-full bg-gradient-to-b duration-300 ease-in-out animate-in dark:from-10% peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]] mb-4`}
      >
        <div className="max-w-4xl sm:px-4 mx-auto">
          {messages.length === 0 && (
            <>
              <div className="max-w-4xl sm:px-4 mx-auto flex flex-col justify-end items-center h-screen pb-[10rem]">
                <Pulse
                  width="45"
                  height="45"
                  className="text-slate-500 dark:text-slate-400"
                />
                <div className="pl-2 text-center text-4xl uppercase leading-tight text-slate-500 dark:text-slate-400">
                  DAVAI
                </div>
              </div>

              <InitialQueries
                questions={[
                  "What is liver cancer and how does it effect people?",
                  "How do scientists use excipients for vaccines?",
                  "Inactive ingredient moelcule mackeup.",
                  "What is liver cancer and how does it effect people?",
                ]}
                handleFollowUpClick={handleFollowUpClick}
              />
            </>
          )}

          <form
            ref={formRef}
            onSubmit={async (e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleFormSubmit(e);
              setCurrentLlmResponse("");
              if (window.innerWidth < 600) {
                (e.target as HTMLFormElement)["message"]?.blur();
              }
              const value = inputValue.trim();
              setInputValue("");
              if (!value) return;
            }}
          >
            <div className="shadow-lg relative flex flex-col w-full overflow-hidden max-h-60 grow dark:bg-slate-800 bg-gray-100 rounded-md border sm:px-2">
              <div className="flex overflow-x-auto">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group mx-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="absolute right-0 top-0 opacity-0 group-hover:opacity-100"
                          onClick={() => removeImagePreview(index)}
                          type="button" // Ensure this is 'button' to prevent form submission
                          variant="link"
                          size="icon"
                        >
                          <XCircle fill="black" width="25" height="25" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove</TooltipContent>
                    </Tooltip>
                    <img
                      src={src}
                      alt="Preview"
                      style={{ width: "70px", height: "70px" }}
                      className="rounded-md border"
                    />
                  </div>
                ))}
              </div>

              <div className="absolute left-3 top-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={triggerFileSelect}
                      type="button" // Ensure this is 'button' to prevent form submission
                      variant="link"
                      size="icon"
                    >
                      <FilePlus
                        width="25"
                        height="25"
                        className="text-slate-500 dark:text-slate-400"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Upload</TooltipContent>
                </Tooltip>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFilesChange}
                  accept="image/*,.pdf,.mol"
                  style={{ display: "none" }} // Keep the input hidden
                />
              </div>
              <div className="flex overflow-x-auto"></div>
              <Textarea
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) =>
                  setInputValue(e.currentTarget.value)
                }
                placeholder="Send a message..."
                className="w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm dark:text-white text-black pl-16 pr-16"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                name="message"
                rows={1}
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setInputValue(e.target.value)
                }
              />

              <ChatScrollAnchor trackVisibility={true} />
              <div className="absolute right-8 pr-6 top-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none text-slate-500 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={(e) => console.log(e)}
                        className="toggle-checkbox absolute block w-6 h-6 text-slate-500 dark:text-slate-400 border-4 rounded-full appearance-none cursor-pointer"
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Copilot</TooltipContent>
                </Tooltip>
              </div>
              <div className="absolute right-4 top-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      disabled={inputValue === ""}
                    >
                      <ArrowUp width="20" height="20" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send message</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="pb-[80px] pt-4 md:pt-10"></div>
    </div>
  );
}
