// "use client";

// import React, { useState, useEffect } from "react";
// import { viewPolls, deletePoll, flagPoll, isAdmin } from "@/lib/polls";
// import { Avatar } from "@/components/ui/avatar";
// import { Flag, FlagOff, CheckCheck, X, Vote } from "lucide-react";
// import toast from "react-hot-toast";
// import { formatDate } from "@/utils/dateUtils";
// import Link from "next/link";
// import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";
// import { EllipsisVertical } from "lucide-react";
// import DeletePollDialog from "@/components/layouts/DeletePollDialog";
// import FlagPollDialog from "@/components/layouts/FlagPollDialog";
// import EditPollDialog from "@/components/layouts/EditPollDialog";
// import Toolbar from "@/components/layouts/Toolbar";
// import FirstPollCTA from "@/components/layouts/FirstPollCTA";
// import Loading from "@/components/ui/Loading";

// interface Poll {
//   id: string;
//   title: string;
//   statement: string;
//   options: string[];
//   creatorId: string;
//   createdAt: Date;
//   status: string;
//   flagged: boolean;
//   creatorName?: string;
//   creatorAvatar?: string;
// }

// interface PollData {
//   title: string;
//   statement: string;
//   options: string[];
//   startDate: Date;
//   endDate: Date;
// }

// const PollsList = () => {
//   const [polls, setPolls] = useState<Poll[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [currentUserId] = useState<string>("5nAhIg1OJCWT6xrvPgHfkeJ3tLr1");
//   const [isAdminUser, setIsAdminUser] = useState(false);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state

//   useEffect(() => {
//     // Simulate loading delay
//     const timeout = setTimeout(() => setIsLoading(false), 2000); // 2 seconds delay
    
//     const fetchPolls = async () => {
//       try {
//         const fetchedPolls = await viewPolls({ creatorId: currentUserId });
//         setPolls(
//           fetchedPolls.map((poll) => ({
//             ...poll,
//             statement: poll.statement ?? "",
//           }))
//         );
//       } catch (error) {
//         setError(
//           error instanceof Error
//             ? `Error fetching polls: ${error.message}`
//             : "An unknown error occurred"
//         );
//       }
//     };

//     const checkAdminStatus = async () => {
//       const adminStatus = await isAdmin(currentUserId);
//       setIsAdminUser(adminStatus);
//     };

//     fetchPolls();
//     checkAdminStatus();

//     return () => clearTimeout(timeout); // Clear timeout if the component unmounts
//   }, [currentUserId]);

//   const handleDelete = async (pollId: string) => {
//     try {
//       await deletePoll(currentUserId, pollId);
//       setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
//       toast.success("Poll deleted successfully.");
//     } catch (error) {
//       console.error("Error deleting poll:", error);
//       toast.error("Failed to delete poll.");
//     }
//   };

//   const handleFlagToggle = async (pollId: string) => {
//     try {
//       const poll = polls.find((p) => p.id === pollId);
//       if (poll) {
//         const newStatus = poll.flagged ? "active" : "flagged";
        
//         await flagPoll(currentUserId, pollId, newStatus);
//         setPolls((prevPolls) =>
//           prevPolls.map((poll) =>
//             poll.id === pollId
//               ? { ...poll, flagged: !poll.flagged, status: newStatus }
//               : poll
//           )
//         );
//         toast.success(poll.flagged ? "Poll unflagged successfully." : "Poll flagged successfully.");
//       }
//     } catch (error) {
//       console.error("Error flagging/unflagging poll:", error);
//       toast.error("Failed to flag/unflag poll.");
//     }
//   };

//   const mapPollToPollData = (poll: Poll): PollData => ({
//     title: poll.title,
//     statement: poll.statement,
//     options: poll.options,
//     startDate: new Date(),
//     endDate: new Date(),
//   });

//   const filteredPolls = polls.filter(
//     (poll) =>
//       poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       poll.statement.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (isLoading) {
//     return <Loading />;
//   }

//   return (
//     <div className="p-4 space-y-5">
//       <Toolbar setSearchQuery={setSearchQuery} />
//       {filteredPolls.length > 0 ? (
//         <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredPolls.map((poll) => (
//             <div
//               key={poll.id}
//               className="border border-gray-500/50 dark:border-gray-700/50 bg-white/80 dark:bg-[#0a0a0a] rounded-lg shadow p-5 flex flex-col gap-3 cursor-pointer hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-200 ease-linear"
//             >
//               <div className="flex items-center w-full justify-between gap-2">
//                 <div className="flex items-center gap-2">
//                   <Avatar
//                     name="avatar"
//                     src={poll.creatorAvatar}
//                     className="size-6"
//                   />
//                   <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
//                     {poll.creatorName || "Unknown Creator"}
//                   </span>
//                 </div>
                
//                 {/* Show the menu only if the user is the creator or an admin */}
//                 {(isAdminUser || poll.creatorId === currentUserId) && (
//                   <MenuRoot>
//                     <MenuTrigger asChild>
//                       <EllipsisVertical />
//                     </MenuTrigger>
//                     <MenuContent className="">
//                       {isAdminUser && (
//                         <MenuItem value="flag">
//                           <FlagPollDialog
//                             pollId={poll.id}
//                             flagged={poll.flagged}
//                             onFlagToggle={handleFlagToggle} // Updated
//                           />
//                         </MenuItem>
//                       )}
//                       {/* Show Edit Poll only for admin or creator */}
//                       {(isAdminUser || poll.creatorId === currentUserId) && (
//                         <MenuItem value="edit">
//                           <EditPollDialog pollId={poll.id} currentData={mapPollToPollData(poll)} />
//                         </MenuItem>
//                       )}
//                       {(isAdminUser || poll.creatorId === currentUserId) && (
//                         <MenuItem value="delete">
//                           <DeletePollDialog pollId={poll.id} onDelete={handleDelete} />
//                         </MenuItem>
//                       )}
//                     </MenuContent>
//                   </MenuRoot>
//                 )}
//               </div>
//               <div className="flex items-center gap-2 bg-gray-800/50 dark:bg-gray-200/50 w-fit px-3 py-1 rounded-full">
//                 <Vote className="size-4 text-white dark:text-black" />
//                 <h3 className="font-semibold text-sm text-white dark:text-black">
//                   {poll.title}
//                 </h3>
//               </div>

//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 <Link
//                   href="/dashboard/polls/slug"
//                   className="text-gray-600 dark:text-gray-200 hover:underline"
//                 >
//                   {poll.statement}
//                 </Link>
//                 <strong> {formatDate(poll.createdAt)}</strong>
//               </p>
//               <div className="flex items-center justify-between">
//                 <span
//                   className={`text-sm font-medium ${
//                     poll.status === "active"
//                       ? "text-green-500 dark:text-green-400"
//                       : "text-red-500 dark:text-red-400"
//                   }`}
//                 >
//                   {poll.status === "active" ? (
//                     <>
//                       <CheckCheck size={16} className="inline-block mr-1" />
//                       Active
//                     </>
//                   ) : (
//                     <>
//                       <X size={16} className="inline-block mr-1" />
//                       Inactive
//                     </>
//                   )}
//                 </span>
//                 <span
//                   className={`text-sm ${
//                     poll.flagged
//                       ? "text-red-500 dark:text-red-400"
//                       : "text-gray-400 dark:text-gray-500"
//                   }`}
//                 >
//                   {poll.flagged ? (
//                     <Flag size={16} className="inline-block" />
//                   ) : (
//                     <FlagOff size={16} className="inline-block" />
//                   )}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         filteredPolls.length === 0 && searchQuery ? (
//           <p>No results found.</p>
//         ) : (
//           polls.length === 0 && <FirstPollCTA />
//         )
//       )}
//     </div>
//   );
// };

// export default PollsList;






"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { viewPolls, deletePoll, flagPoll, isAdmin } from "@/lib/polls";
import { Avatar } from "@/components/ui/avatar";
import { Flag, FlagOff, CheckCheck, X, Vote } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { EllipsisVertical } from "lucide-react";
import DeletePollDialog from "@/components/layouts/DeletePollDialog";
import FlagPollDialog from "@/components/layouts/FlagPollDialog";
import EditPollDialog from "@/components/layouts/EditPollDialog";
import Toolbar from "@/components/layouts/Toolbar";
import FirstPollCTA from "@/components/layouts/FirstPollCTA";
import Loading from "@/components/ui/Loading";

interface Poll {
  id: string;
  title: string;
  statement: string;
  options: string[];
  creatorId: string;
  createdAt: Date;
  status: string;
  flagged: boolean;
  creatorName?: string;
  creatorAvatar?: string;
}

interface PollData {
  title: string;
  statement: string;
  options: string[];
  startDate: Date;
  endDate: Date;
}

interface PollsListProps {
  viewMode?: "creator" | "admin"; // Optional view mode prop
}

const PollsList: React.FC<PollsListProps> = ({ viewMode }) => {
  const { currentUserId } = useAuth(); // Retrieve the logged-in user's ID
  const [polls, setPolls] = useState<Poll[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 2000); // Simulate loading delay

    const fetchPolls = async () => {
      try {
        const creatorId = viewMode === "creator" ? currentUserId || undefined : undefined;
        const fetchedPolls = await viewPolls({ creatorId });
        setPolls(
          fetchedPolls.map((poll) => ({
            ...poll,
            statement: poll.statement ?? "",
          }))
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? `Error fetching polls: ${error.message}`
            : "An unknown error occurred"
        );
      }
    };

    const checkAdminStatus = async () => {
      if (currentUserId) {
        const adminStatus = await isAdmin(currentUserId);
        setIsAdminUser(adminStatus);
      }
    };

    fetchPolls();
    checkAdminStatus();

    return () => clearTimeout(timeout); // Clear timeout if the component unmounts
  }, [currentUserId, viewMode]);

  const handleDelete = async (pollId: string) => {
    if (!currentUserId) {
      toast.error("User not authenticated.");
      return;
    }
    try {
      await deletePoll(currentUserId, pollId);
      setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
      toast.success("Poll deleted successfully.");
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error("Failed to delete poll.");
    }
  };

  const handleFlagToggle = async (pollId: string) => {
    if (!currentUserId) {
      toast.error("User not authenticated.");
      return;
    }
    try {
      const poll = polls.find((p) => p.id === pollId);
      if (poll) {
        const newStatus = poll.flagged ? "active" : "flagged";
        await flagPoll(currentUserId, pollId, newStatus);
        setPolls((prevPolls) =>
          prevPolls.map((poll) =>
            poll.id === pollId
              ? { ...poll, flagged: !poll.flagged, status: newStatus }
              : poll
          )
        );
        toast.success(poll.flagged ? "Poll unflagged successfully." : "Poll flagged successfully.");
      }
    } catch (error) {
      console.error("Error flagging/unflagging poll:", error);
      toast.error("Failed to flag/unflag poll.");
    }
  };

  const mapPollToPollData = (poll: Poll): PollData => ({
    title: poll.title,
    statement: poll.statement,
    options: poll.options,
    startDate: new Date(),
    endDate: new Date(),
  });

  const filteredPolls = polls.filter(
    (poll) =>
      (!viewMode || poll.creatorId === currentUserId) &&
      (poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poll.statement.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-4 space-y-5">
      <Toolbar setSearchQuery={setSearchQuery} />
      {filteredPolls.length > 0 ? (
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPolls.map((poll) => (
            <div
              key={poll.id}
              className="border border-gray-500/50 dark:border-gray-700/50 bg-white/80 dark:bg-[#0a0a0a] rounded-lg shadow p-5 flex flex-col gap-3 cursor-pointer hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-200 ease-linear"
            >
              <div className="flex items-center w-full justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Avatar
                    name="avatar"
                    src={poll.creatorAvatar}
                    className="size-6"
                  />
                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {poll.creatorName || "Unknown Creator"}
                  </span>
                </div>

                {(isAdminUser || poll.creatorId === currentUserId) && (
                  <MenuRoot>
                    <MenuTrigger asChild>
                      <EllipsisVertical />
                    </MenuTrigger>
                    <MenuContent>
                      {isAdminUser && (
                        <MenuItem value="flag">
                          <FlagPollDialog
                            pollId={poll.id}
                            flagged={poll.flagged}
                            onFlagToggle={handleFlagToggle}
                          />
                        </MenuItem>
                      )}
                      {poll.creatorId === currentUserId && (
                        <>
                          <MenuItem value="edit">
                            <EditPollDialog
                              pollId={poll.id}
                              currentData={mapPollToPollData(poll)}
                            />
                          </MenuItem>
                          <MenuItem value="delete">
                            <DeletePollDialog
                              pollId={poll.id}
                              onDelete={handleDelete}
                            />
                          </MenuItem>
                        </>
                      )}
                    </MenuContent>
                  </MenuRoot>
                )}
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 dark:bg-gray-200/50 w-fit px-3 py-1 rounded-full">
                <Vote className="size-4 text-white dark:text-black" />
                <h3 className="font-semibold text-sm text-white dark:text-black">
                  {poll.title}
                </h3>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                <Link
                  href="/dashboard/polls/slug"
                  className="text-gray-600 dark:text-gray-200 hover:underline"
                >
                  {poll.statement}
                </Link>
                <strong> {formatDate(poll.createdAt)}</strong>
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    poll.status === "active"
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {poll.status === "active" ? (
                    <>
                      <CheckCheck size={16} className="inline-block mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <X size={16} className="inline-block mr-1" />
                      Inactive
                    </>
                  )}
                </span>
                <span
                  className={`text-sm ${
                    poll.flagged
                      ? "text-red-500 dark:text-red-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {poll.flagged ? (
                    <Flag size={16} className="inline-block" />
                  ) : (
                    <FlagOff size={16} className="inline-block" />
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        filteredPolls.length === 0 && searchQuery ? (
          <p>No results found.</p>
        ) : (
          polls.length === 0 && <FirstPollCTA />
        )
      )}
    </div>
  );
};

export default PollsList;
