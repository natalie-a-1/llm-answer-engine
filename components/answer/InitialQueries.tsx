import React from 'react';
import { IconPlus } from '@/components/ui/icons';

interface InitialQueriesProps {
  questions: string[];
  handleFollowUpClick: (question: string) => void;
}

const InitialQueries = ({ questions, handleFollowUpClick }: InitialQueriesProps) => {
  const handleQuestionClick = (question: string) => {
    handleFollowUpClick(question);
  };

  return (
    <div className="p-4">
      <ul className="grid grid-cols-2 gap-2 mt-0">
        {questions.map((question, index) => (
          <li
            key={index}
            className="flex items-center cursor-pointer dark:bg-slate-800 bg-white shadow-lg rounded-lg p-4"
            onClick={() => handleQuestionClick(question)}
          >
            {/* <span role="img" aria-label="link" className="mr-2 dark:text-white text-slate-500 dark:text-slate-400">
              <IconPlus />
            </span> */}
            <p className="dark:text-white block sm:inline text-md sm:text-md font-semibold text-slate-500 dark:text-slate-400">{question}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InitialQueries;
