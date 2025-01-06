import React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Flag, FlagOff } from "lucide-react";

interface FlagPollDialogProps {
  pollId: string;
  onFlagToggle: (pollId: string) => void;
  flagged: boolean;
}

const FlagPollDialog: React.FC<FlagPollDialogProps> = ({
  pollId,
  onFlagToggle,
  flagged,
}) => {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-5 flex justify-start items-center rounded-md border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-200"
        >
          {flagged ? (
            <>
              <FlagOff className="size-4" />
              <span>Unflag</span>
            </>
          ) : (
            <>
              <Flag className="size-4" />
              <span>Flag</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md font-bold bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-lg dark:text-gray-100 transition-all duration-200 ease-linear">
            {flagged ? "Unflag Poll" : "Flag Poll"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {flagged
              ? "Are you sure you want to unflag this poll?"
              : "Are you sure you want to flag this poll?"}
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" className="text-gray-600 dark:text-gray-300 h-8 px-2">
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            onClick={() => onFlagToggle(pollId)}
            className="ml-3 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 h-8 px-2"
          >
            Confirm
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default FlagPollDialog;
