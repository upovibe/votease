import React from "react";
import { Button } from "@chakra-ui/react";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CreatePoll from "@/components/form/CreatePoll";

const FirstPollCTA = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-gray-800 dark:text-white">
          Create Your First Poll
        </h2>
        <p className="text-lg text-gray-500 mb-6">
          It’s quick and easy! Just ask a question, add options, and share. Let
          the voting begin!
        </p>

        <DialogRoot scrollBehavior="inside" size="sm">
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-full hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
            >
              Create Poll
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold mb-6 text-center">
                Create a Poll
              </DialogTitle>
            </DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <CreatePoll />
            </DialogBody>
          </DialogContent>
        </DialogRoot>
      </div>
    </div>
  );
};

export default FirstPollCTA;
