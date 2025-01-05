import { Button } from "@chakra-ui/react";
import React from "react";

const FirstPollCTA = ({ onCreatePoll }: { onCreatePoll: () => void }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-gray-800 dark:text-white">Create Your First Poll</h2>
        <p className="text-lg text-gray-500 mb-6">
          It’s quick and easy! Just ask a question, add options, and share. Let the voting begin!
        </p>
        <Button
          onClick={onCreatePoll}
          size="lg"
          className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-full hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
        >
          Create Poll
        </Button>
      </div>
    </div>
  );
};

export default FirstPollCTA;