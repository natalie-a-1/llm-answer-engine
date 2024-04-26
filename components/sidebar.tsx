'use client';

import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from "react";

export function Sidebar() {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    console.log("Toggle modal called, current state before toggle:", isModalOpen);
    const newState = !isModalOpen;

    console.log("Setting state to:", newState);
    setModalOpen(newState);  // Correctly toggle the state
};


  return (
    <>
    <div className="dark:from-gray-900/10 fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out">
      <div className="flex flex-col bg-gray-800 text-white h-full">
        {" "}
        <div className="p-4 flex items-center space-x-2">
          <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-500 dark:text-slate-400">
            DAVAI
          </span>
          <img
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&amp;shade=500"
            alt="Your Company"
            className="h-8"
          />
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
        
        {/* Settings Button */}
        <div className="mt-auto flex justify-end p-4">
          <Button variant="outline" asChild onClick={toggleModal}>
             <a
               className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white font-semibold py-2 px-4 rounded shadow"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FFFFFF" viewBox="0 0 256 256"><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path></svg>
            </a>
         </Button>
        </div>
      </div>
    </div>
    
    <SettingsModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
};

const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    model: 'groq-mixtral',
    toggleSetting: false,
    dropdownSetting: 'Option 1',
    textChunkSize: 1000,
    textChunkOverlap: 400,
    prompt: "",
    // similarityResults: 4,
    // pagesToScan: 10,
    knowledgeGraph: 1,
    vectorDatabase: 1,
  });
  
    useEffect(() => {
      const storedSettings = localStorage.getItem('settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem('settings', JSON.stringify(settings));
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
      <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center`}>
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
                onChange={(e) => handleSettingsChange('prompt', e)}
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
                onChange={(e) => handleSettingsChange('model', e)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="groq-mixtral">Groq: Mixtral</option>
                <option value="groq-llama-2-70b">Groq: Llama 2 70B</option>
                <option value="groq-gemma">Groq: Gemma</option>
              </select>
            </div>
            {/* <div className="mb-4">
              <label className="block mb-2 font-semibold">Show Sources in UI</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.toggleSetting}
                  onChange={(e) => handleSettingsChange('toggleSetting', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 bg-white border-4 rounded-full appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div> */}
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
                  onChange={(e) => handleSettingsChange('textChunkSize', Number(e.target.value))}
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
                  onChange={(e) => handleSettingsChange('textChunkOverlap', Number(e.target.value))}
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
                  onChange={(e) => handleSettingsChange('knowledgeGraph', Number(e.target.value))}
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
                  onChange={(e) => handleSettingsChange('vectorDatabase', Number(e.target.value))}
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