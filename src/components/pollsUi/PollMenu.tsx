import React from "react";
import Link from "next/link";
import { EllipsisVertical, View } from "lucide-react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import FlagPollDialog from "@/components/layouts/FlagPollDialog";
import EditPollDialog from "@/components/layouts/EditPollDialog";
import DeletePollDialog from "@/components/layouts/DeletePollDialog";

// Define the Poll type explicitly
interface Poll {
  id: string;
  flagged: boolean;
  title: string;
  statement?: string;
  options: string[];
  startDate: string; // Keep as string
  endDate: string;   // Keep as string
}

// Use the defined Poll type in PollMenuProps
interface PollMenuProps {
  isAdminUser: boolean;
  canEditOrDelete: boolean;
  poll: Poll;  // poll is of type Poll
  onFlagToggle: (pollId: string) => void;
  onDelete: (pollId: string) => void;
  mapPollToPollData: (poll: Poll) => {
    title: string;
    statement: string;
    options: string[];
    startDate: Date;  // map to Date
    endDate: Date;    // map to Date
  };
}

const PollMenu: React.FC<PollMenuProps> = ({
  isAdminUser,
  canEditOrDelete,
  poll,
  onFlagToggle,
  onDelete,
  mapPollToPollData,
}) => (
  <MenuRoot>
    <MenuTrigger asChild>
      <div className="cursor-pointer">
        <EllipsisVertical />
      </div>
    </MenuTrigger>
    <MenuContent>
      <MenuItem value="view">
        <Link
          href="/profile"
          className="w-full h-5 flex justify-start items-center rounded-md border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-200 gap-2"
        >
          <View className="size-4" />
          <span>View Profile</span>
        </Link>
      </MenuItem>
      {isAdminUser && (
        <MenuItem value="flag">
          <FlagPollDialog
            pollId={poll.id}
            flagged={poll.flagged}
            onFlagToggle={onFlagToggle}
          />
        </MenuItem>
      )}
      {canEditOrDelete && (
        <>
          <MenuItem value="edit">
            <EditPollDialog
              pollId={poll.id}
              currentData={mapPollToPollData(poll)}  // pass converted data
            />
          </MenuItem>
          <MenuItem value="delete">
            <DeletePollDialog pollId={poll.id} onDelete={onDelete} />
          </MenuItem>
        </>
      )}
    </MenuContent>
  </MenuRoot>
);

export default PollMenu;
