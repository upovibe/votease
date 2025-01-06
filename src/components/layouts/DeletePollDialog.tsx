import React from 'react';
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
import { Trash } from 'lucide-react';

interface DeletePollDialogProps {
  pollId: string;
  onDelete: (pollId: string) => void;
}

const DeletePollDialog: React.FC<DeletePollDialogProps> = ({ pollId, onDelete }) => {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-5 flex justify-start items-center rounded-md border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-200"
        >
          <Trash className="inline-block size-4" />
          <span>Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md font-bold bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-lg dark:text-gray-100 transition-all duration-200 ease-linear">
            Are you sure you want to delete this poll?
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            This action is irreversible.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button
              variant="outline"
              className="text-gray-600 dark:text-gray-300 h-8 px-2"
            >
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            onClick={() => onDelete(pollId)}
            className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600 h-8 px-2"
          >
            Delete
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default DeletePollDialog;
