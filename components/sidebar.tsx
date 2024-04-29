"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { ChatCircleText, Gear, Pulse, NotePencil } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    console.log(
      "Toggle modal called, current state before toggle:",
      isModalOpen
    );
    const newState = !isModalOpen;

    console.log("Setting state to:", newState);
    setModalOpen(newState); // Correctly toggle the state
  };

  return (
    <>
      <div className="dark:from-gray-900/10 fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out">
        <div className="flex flex-col bg-gray-800 text-white h-full">
          <div className="p-4 flex items-center space-x-2 pt-8">
            <Pulse width="25" height="25" className="dark:text-slate-400" />
            <span className="text-center uppercase leading-tighttext-lg sm:text-xl lg:text-2xl text-slate-500 dark:text-slate-400">
              DAVAI
            </span>
          </div>
          {/* Chat history */}
          <nav className="flex-grow">
            <ul className="flex flex-col space-y-4 mt-4">
              <li>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="flex items-center mx-2 px-2 py-2 bg-gray-700 rounded-md hover:bg-gray-600 text-sm"
                    >
                      Example history for Cancer
                    </a>
                  </li>
                  {/* Repeat for other team links */}
                </ul>
              </li>
              <li>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="flex items-center mx-2 px-2 py-2 bg-gray-700 rounded-md hover:bg-gray-600 text-sm"
                    >
                      Example history for Not Cancer
                    </a>
                  </li>
                  {/* Repeat for other team links */}
                </ul>
              </li>
            </ul>
          </nav>

          <div className="mt-auto flex justify-between p-4 items-center w-full">
            {/* New Chat Button */}
            <Button
              variant="outline"
              asChild
              onClick={() => console.log("clicked")}
            >
              <a className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white font-semibold py-2 px-4 rounded shadow">
                <ChatCircleText />
              </a>
            </Button>

          {/* Settings Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative inline-block w-10 mr-2 align-middle select-none text-slate-500 dark:text-slate-400">
                  <Button variant="outline" asChild onClick={toggleModal}>
                    <a className="py-2 px-4 dark:bg-slate-800">
                      <Gear
                        width="25"
                        height="25"
                        className="text-slate-500 dark:text-slate-400"
                      />
                    </a>
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>

          </div>
        </div>
      </div>

      <SettingsModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
}

const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState({
    model: "groq-mixtral",
    toggleSetting: false,
    dropdownSetting: "Option 1",
    textChunkSize: 1000,
    textChunkOverlap: 400,
    prompt: "",
    // similarityResults: 4,
    // pagesToScan: 10,
    knowledgeGraph: 1,
    vectorDatabase: 1,
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem("settings");
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const handleSettingsChange = (field: keyof typeof settings, value: any) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [field]: value,
    }));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center`}
    >
      <div className="bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out transform p-6 w-full max-w-4xl overflow-y-auto rounded-lg">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-4 py-6">
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Prompts</label>
            <select
              value={settings.prompt}
              onChange={(e) => handleSettingsChange("prompt", e)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="groq-mixtral">Drug Database Manager</option>
              <option value="groq-llama-2-70b">Excipient Data Analyst</option>
              <option value="groq-gemma">Molecular Drug Researcher</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Model</label>
            <select
              value={settings.model}
              onChange={(e) => handleSettingsChange("model", e)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="groq-mixtral">Groq: Mixtral</option>
              <option value="groq-llama-2-70b">Groq: Llama 2 70B</option>
              <option value="groq-gemma">Groq: Gemma</option>
            </select>
          </div>

          <div className="mb-4 flex items-center space-x-4">
            <div className="pr-12">
              <label className="font-semibold">Shopping Search</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.toggleSetting}
                  onChange={(e) =>
                    handleSettingsChange("toggleSetting", e.target.checked)
                  }
                  className="toggle-checkbox absolute block w-6 h-6 bg-white border-4 rounded-full appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>

            <div className="pr-12">
              <label className="font-semibold">Maps Search</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.toggleSetting}
                  onChange={(e) =>
                    handleSettingsChange("toggleSetting", e.target.checked)
                  }
                  className="toggle-checkbox absolute block w-6 h-6 bg-white border-4 rounded-full appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>

            <div>
              <label className="font-semibold">Chart Search</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.toggleSetting}
                  onChange={(e) =>
                    handleSettingsChange("toggleSetting", e.target.checked)
                  }
                  className="toggle-checkbox absolute block w-6 h-6 bg-white border-4 rounded-full appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Text Chunk Size: {settings.textChunkSize}
              </label>
              <input
                type="range"
                min="500"
                max="2000"
                step="100"
                value={settings.textChunkSize}
                onChange={(e) =>
                  handleSettingsChange("textChunkSize", Number(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Text Chunk Overlap: {settings.textChunkOverlap}
              </label>
              <input
                type="range"
                min="200"
                max="800"
                step="100"
                value={settings.textChunkOverlap}
                onChange={(e) =>
                  handleSettingsChange(
                    "textChunkOverlap",
                    Number(e.target.value)
                  )
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Knowledge Graph Sources: {settings.knowledgeGraph}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={settings.knowledgeGraph}
                onChange={(e) =>
                  handleSettingsChange("knowledgeGraph", Number(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Vector Database Sources: {settings.vectorDatabase}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={settings.vectorDatabase}
                onChange={(e) =>
                  handleSettingsChange("vectorDatabase", Number(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
