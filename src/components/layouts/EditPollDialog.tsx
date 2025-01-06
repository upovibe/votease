import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogActionTrigger, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogRoot, DialogTrigger } from "@/components/ui/dialog";
import EditPoll from "@/components/form/EditPoll";
import { Edit } from "lucide-react";

// Define an interface for the poll data structure
interface PollData {
    title: string;
    statement: string;
    options: string[];
    startDate: Date;
    endDate: Date;
  }

const EditPollDialog: React.FC<{ pollId: string; currentData: PollData }> = ({ pollId, currentData }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Modify the onOpenChange handler to extract the open state from OpenChangeDetails
  const handleDialogOpenChange = (details: { open: boolean }) => {
    setIsOpen(details.open);
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-5 flex justify-start items-center rounded-md border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-200">
          <Edit className="inline-block size-4"/>
          <span>Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Poll</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <EditPoll pollId={pollId} currentData={currentData} onClose={() => setIsOpen(false)} />
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" className="text-gray-600 dark:text-gray-300 h-8 px-2" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditPollDialog;
