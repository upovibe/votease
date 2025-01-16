import React from "react";
import { Button, Input} from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { Plus, RefreshCcw, Search } from "lucide-react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { createListCollection } from "@chakra-ui/react";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreatePoll from "@/components/form/CreatePoll";

// Explicitly define the type for the props
interface ToolbarProps {
  setSearchQuery: (query: string) => void;
  refreshComponent: () => void; // Add this prop
}

const Toolbar: React.FC<ToolbarProps> = ({ setSearchQuery, refreshComponent }) => {
  const items = [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
  ];

  const collection = createListCollection({ items });

  return (
    <div className="container flex gap-2 items-center mx-auto">
      <InputGroup
        flex="1"
        startElement={<Search size={15} />}
      >
        <Input
          placeholder="Search polls by title or statement"
          className="border dark:border-gray-800 text-black dark:text-white transition-all duration-300 focus:ring-2"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      <SelectRoot
        collection={collection}
        size="sm"
        className="w-2/12 hidden lg:inline-flex px-2 border dark:border-gray-800 text-black dark:text-white transition-all duration-300 focus:ring-2rounded"
      >
        <SelectTrigger>
          <SelectValueText placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {collection.items.map((item) => (
            <SelectItem item={item} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
      <DialogRoot scrollBehavior="inside" size="sm">
        <DialogTrigger asChild>
          <Button className="px-2 h-9 bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition-all duration-300">
            <Plus />
            <span className="hidden lg:inline-block"> Add new poll</span>
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
      <RefreshCcw onClick={refreshComponent} className="cursor-pointer" />
    </div>
  );
};

export default Toolbar;